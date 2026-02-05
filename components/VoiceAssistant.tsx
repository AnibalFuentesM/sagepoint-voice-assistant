import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type, Chat, GenerateContentResponse, Part } from '@google/genai';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '../utils/audioUtils';
import { SAGEPOINT_INFO } from '../constants';
import { submitToGoogleSheet, fetchKnowledgeBase, FAQItem } from '../utils/sheetUtils';

const API_KEY = process.env.API_KEY || '';
const LIVE_MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025';
const CHAT_MODEL = 'gemini-2.5-flash';
const STORAGE_KEY = 'sagepoint_chat_history';

// Tool Definition
const scheduleAppointmentTool: FunctionDeclaration = {
    name: 'scheduleAppointment',
    parameters: {
        type: Type.OBJECT,
        description: 'Agendar una cita de consultoría.',
        properties: {
            name: { type: Type.STRING, description: 'Nombre del usuario' },
            email: { type: Type.STRING, description: 'Correo electrónico' },
            date: { type: Type.STRING, description: 'Fecha (YYYY-MM-DD)' },
            time: { type: Type.STRING, description: 'Hora (HH:MM)' },
        },
        required: ['name', 'email', 'date'],
    },
};

const TOOLS = [{ functionDeclarations: [scheduleAppointmentTool] }];

type Message = {
    id: string;
    role: 'user' | 'model' | 'system';
    text: string;
    isPartial?: boolean;
};

interface VoiceAssistantProps {
    lang: 'es' | 'en';
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ lang }) => {
    // UI State
    const [isOpen, setIsOpen] = useState(false);
    const [isLive, setIsLive] = useState(false); // Live Voice Mode
    const [isConnecting, setIsConnecting] = useState(false);
    const [volume, setVolume] = useState(0);
    const [knowledgeBase, setKnowledgeBase] = useState<string>('');

    const uiText = {
        title: lang === 'es' ? 'Asistente Sage' : 'Sage Assistant',
        listening: lang === 'es' ? 'Escuchando...' : 'Listening...',
        placeholder: lang === 'es' ? 'Escribe un mensaje...' : 'Type a message...',
        init: lang === 'es' ? 'Hola, soy Sage. ¿En qué puedo ayudarte hoy con respecto a Sagepoint Analytics?' : 'Hi, I am Sage. How can I help you today regarding Sagepoint Analytics?',
        error: lang === 'es' ? 'Lo siento, hubo un error.' : 'Sorry, there was an error.',
        saved: lang === 'es' ? '📅 Cita agendada: ' : '📅 Appointment scheduled: ',
        sheets: lang === 'es' ? ' (Guardado en Sheets)' : ' (Saved to Sheets)',
        micError: lang === 'es' ? 'Error: No se pudo acceder al micrófono.' : 'Error: Could not access microphone.'
    };

    // Persistent Message State
    const [messages, setMessages] = useState<Message[]>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                return saved ? JSON.parse(saved) : [{ id: 'init', role: 'model', text: 'Hola, soy Sage. ¿En qué puedo ayudarte hoy con respecto a Sagepoint Analytics?' }];
            } catch (e) {
                console.error("Failed to load history", e);
            }
        }
        return [{ id: 'init', role: 'model', text: 'Hola, soy Sage. ¿En qué puedo ayudarte hoy con respecto a Sagepoint Analytics?' }];
    });

    // Load Knowledge Base from Sheets on Mount
    useEffect(() => {
        const loadData = async () => {
            const faqs = await fetchKnowledgeBase();
            if (faqs && faqs.length > 0) {
                const faqText = faqs.map(f => `P: ${f.question}\nR: ${f.answer}`).join('\n\n');
                console.log("Knowledge base loaded:", faqs.length, "items");
                setKnowledgeBase(faqText);
                // Reset chat client to force new system instructions
                chatClientRef.current = null;
            }
        };
        loadData();
    }, []);

    // If language changes and history is empty/default, update greeting
    useEffect(() => {
        if (messages.length === 1 && messages[0].id === 'init') {
            setMessages([{ id: 'init', role: 'model', text: uiText.init }]);
        }
    }, [lang]);

    // Reset chat client when language changes to update system instruction
    useEffect(() => {
        chatClientRef.current = null;
    }, [lang]);

    const [inputText, setInputText] = useState("");
    const [isProcessingText, setIsProcessingText] = useState(false);

    // Refs for Audio/Session
    const inputContextRef = useRef<AudioContext | null>(null);
    const outputContextRef = useRef<AudioContext | null>(null);
    const inputProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const outputNodeRef = useRef<GainNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const activeSessionRef = useRef<any>(null);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);

    // Refs for Chat
    const chatClientRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const currentTranscriptionRef = useRef<{ user: string, model: string }>({ user: '', model: '' });

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    // Persist messages
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    const clearHistory = () => {
        const initialMsg: Message = { id: Date.now().toString(), role: 'model', text: uiText.init };
        setMessages([initialMsg]);
        localStorage.removeItem(STORAGE_KEY);
    };

    // Cleanup Function
    const cleanupAudio = useCallback(() => {
        // Save any pending transcription before closing
        const userPending = currentTranscriptionRef.current.user.trim();
        const modelPending = currentTranscriptionRef.current.model.trim();

        if (userPending || modelPending) {
            const newMessages: Message[] = [];
            if (userPending) {
                newMessages.push({ id: Date.now().toString() + 'u', role: 'user', text: userPending });
            }
            if (modelPending) {
                newMessages.push({ id: Date.now().toString() + 'm', role: 'model', text: modelPending });
            }
            if (newMessages.length > 0) {
                setMessages(prev => [...prev, ...newMessages]);
            }

            // Log pending interaction if complete enough
            if (userPending && modelPending) {
                submitToGoogleSheet({
                    type: 'Chat Log (Voice - Partial)',
                    question: userPending,
                    answer: modelPending
                });
            }
        }
        currentTranscriptionRef.current = { user: '', model: '' };

        sourcesRef.current.forEach(source => { try { source.stop(); } catch (e) { } });
        sourcesRef.current.clear();

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (inputProcessorRef.current) {
            inputProcessorRef.current.disconnect();
            inputProcessorRef.current = null;
        }

        if (activeSessionRef.current) {
            try {
                activeSessionRef.current.close();
            } catch (e) {
                console.warn("Error closing session", e);
            }
            activeSessionRef.current = null;
        }

        setIsLive(false);
        setIsConnecting(false);
        nextStartTimeRef.current = 0;
        setVolume(0);
    }, []);

    const getSystemInstruction = () => {
        let instructions = `Eres Sage, el asistente de IA exclusivo de Sagepoint Analytics.
Tu objetivo es asistir a clientes potenciales interesadas en los servicios de Sagepoint (analítica de datos, automatización, dashboards) y ayudarles a agendar citas.

REGLAS DE RESTRICCIÓN:
1. SOLO responde preguntas relacionadas con Sagepoint Analytics.
2. Si el usuario pregunta sobre otros temas, rechaza cortésmente.
3. Intenta siempre guiar la conversación hacia agendar una consultoría.

Información General del Negocio:
${SAGEPOINT_INFO}
`;

        if (knowledgeBase) {
            instructions += `\n\nPREGUNTAS FRECUENTES (Úsalas para responder con precisión):\n${knowledgeBase}`;
        }

        instructions += `\n\nTu idioma principal es: ${lang === 'es' ? 'ESPAÑOL' : 'INGLÉS'}. ${lang === 'en' ? 'Answer all questions in English.' : 'Responde todas las preguntas en Español.'}`;

        return instructions;
    };

    // --- STANDARD CHAT LOGIC ---
    const handleSendText = async () => {
        if (!inputText.trim()) return;
        const text = inputText;
        setInputText("");
        setIsProcessingText(true);

        // Add user message
        const userMsgId = Date.now().toString();
        setMessages(prev => [...prev, { id: userMsgId, role: 'user', text }]);

        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });

            if (!chatClientRef.current) {
                chatClientRef.current = ai.chats.create({
                    model: CHAT_MODEL,
                    config: { systemInstruction: getSystemInstruction(), tools: TOOLS }
                });
            }

            const chat = chatClientRef.current;

            let response = await chat.sendMessage({ message: text });

            // Handle Function Calls loop
            while (response.functionCalls && response.functionCalls.length > 0) {
                // Exec functions
                const functionResponses = await Promise.all(response.functionCalls.map(async (fc) => {
                    const { name, args } = fc;
                    let result = { result: 'Error executing tool' };

                    if (name === 'scheduleAppointment') {
                        const { name: uName, email, date, time } = args as any;

                        // Submit to Sheet
                        const success = await submitToGoogleSheet({
                            name: uName,
                            email: email,
                            date: date,
                            time: time,
                            type: 'Cita Consultoría (Voz/Chat)'
                        });

                        if (success) {
                            result = { result: `Success: Appointment scheduled for ${uName} on ${date} at ${time}` };
                            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: `${uiText.saved}${date} ${time}${uiText.sheets}` }]);
                        } else {
                            result = { result: `Failed to save to calendar system` };
                        }
                    }

                    return {
                        id: fc.id,
                        name: fc.name,
                        response: result
                    };
                }));

                // Send results back - Wrap in parts with correct structure for sendMessage
                const parts: Part[] = functionResponses.map(resp => ({
                    functionResponse: resp
                }));
                response = await chat.sendMessage({ message: parts });
            }

            // Final text response
            const modelText = response.text;
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: modelText }]);

            // LOG INTERACTION TO SHEET
            if (modelText) {
                submitToGoogleSheet({
                    type: 'Chat Log (Text)',
                    question: text,
                    answer: modelText
                });
            }

        } catch (error) {
            console.error("Chat Error", error);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: uiText.error }]);
        } finally {
            setIsProcessingText(false);
        }
    };

    // --- LIVE VOICE LOGIC ---
    const startLiveSession = async () => {
        if (isLive || isConnecting) return;
        setIsConnecting(true);

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Microphone access not supported");
            }

            const ai = new GoogleGenAI({ apiKey: API_KEY });

            // Audio Setup
            inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

            // Resume contexts just in case
            await inputContextRef.current.resume();
            await outputContextRef.current.resume();

            outputNodeRef.current = outputContextRef.current.createGain();
            outputNodeRef.current.connect(outputContextRef.current.destination);

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const sessionPromise = ai.live.connect({
                model: LIVE_MODEL,
                config: {
                    responseModalities: [Modality.AUDIO],
                    systemInstruction: getSystemInstruction(), // Updated to use dynamic info
                    tools: TOOLS,
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
                callbacks: {
                    onopen: () => {
                        console.log('Live Session Connected');
                        setIsConnecting(false);
                        setIsLive(true);

                        // Start Mic Stream
                        if (!inputContextRef.current) return;
                        const source = inputContextRef.current.createMediaStreamSource(stream);
                        const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
                        inputProcessorRef.current = processor;

                        processor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            // Volume meter
                            let sum = 0;
                            for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
                            setVolume(Math.min(Math.sqrt(sum / inputData.length) * 5, 1));

                            const pcmBlob = createPcmBlob(inputData);
                            sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
                        };
                        source.connect(processor);
                        processor.connect(inputContextRef.current.destination);
                    },
                    onmessage: async (msg: LiveServerMessage) => {
                        const session = await sessionPromise;
                        activeSessionRef.current = session;

                        // 1. Handle Audio
                        const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (base64Audio && outputContextRef.current && outputNodeRef.current) {
                            const ctx = outputContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                            const buffer = await decodeAudioData(base64ToUint8Array(base64Audio), ctx, 24000, 1);
                            const source = ctx.createBufferSource();
                            source.buffer = buffer;
                            source.connect(outputNodeRef.current);
                            source.addEventListener('ended', () => sourcesRef.current.delete(source));
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += buffer.duration;
                            sourcesRef.current.add(source);
                        }

                        // 2. Handle Tools
                        if (msg.toolCall) {
                            const responses = await Promise.all(msg.toolCall.functionCalls.map(async (fc) => {
                                let result = { result: 'Error' };
                                if (fc.name === 'scheduleAppointment') {
                                    const { name, email, date, time } = fc.args as any;

                                    // Submit to Sheet
                                    const success = await submitToGoogleSheet({
                                        name: name,
                                        email: email,
                                        date: date,
                                        time: time,
                                        type: 'Cita Consultoría (Voz/Chat)'
                                    });

                                    if (success) {
                                        result = { result: `Success` };
                                        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: `${uiText.saved}${date} ${time}${uiText.sheets}` }]);
                                    } else {
                                        result = { result: `Failed` };
                                    }
                                }
                                return { id: fc.id, name: fc.name, response: result };
                            }));
                            session.sendToolResponse({ functionResponses: responses });
                        }

                        // 3. Handle Transcription
                        const outTrans = msg.serverContent?.outputTranscription;
                        const inTrans = msg.serverContent?.inputTranscription;
                        const turnComplete = msg.serverContent?.turnComplete;

                        if (inTrans) {
                            currentTranscriptionRef.current.user += inTrans.text;
                        }
                        if (outTrans) {
                            currentTranscriptionRef.current.model += outTrans.text;
                        }

                        if (turnComplete) {
                            const userT = currentTranscriptionRef.current.user.trim();
                            const modelT = currentTranscriptionRef.current.model.trim();

                            if (userT) {
                                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userT }]);
                            }
                            if (modelT) {
                                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: modelT }]);
                            }

                            // LOG INTERACTION TO SHEET
                            if (userT && modelT) {
                                submitToGoogleSheet({
                                    type: 'Chat Log (Voice)',
                                    question: userT,
                                    answer: modelT
                                });
                            }

                            currentTranscriptionRef.current.user = '';
                            currentTranscriptionRef.current.model = '';
                        }
                    },
                    onclose: () => {
                        console.log("Live Session Closed");
                        cleanupAudio();
                    },
                    onerror: (err) => {
                        console.error("Live Session Error:", err);
                        cleanupAudio();
                    }
                }
            });

        } catch (e: any) {
            console.error("Connection Failed", e);
            let errorMsg = uiText.micError;

            if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
                errorMsg = lang === 'es' ? 'Error: Se requiere HTTPS para acceder al micrófono.' : 'Error: HTTPS is required for microphone access.';
            } else if (e.name === 'NotAllowedError') {
                errorMsg = lang === 'es' ? 'Error: Permiso de micrófono denegado.' : 'Error: Microphone permission denied.';
            } else if (e.name === 'NotFoundError') {
                errorMsg = lang === 'es' ? 'Error: No se encontró ningún micrófono.' : 'Error: No microphone found.';
            }

            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: errorMsg }]);
            cleanupAudio();
        }
    };

    const stopLiveSession = () => {
        cleanupAudio();
    };

    const toggleLive = () => {
        if (isLive) stopLiveSession();
        else startLiveSession();
    };

    // Render Helpers
    const renderMessage = (msg: Message) => {
        const isUser = msg.role === 'user';
        const isSystem = msg.role === 'system';
        return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`
                  max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                  ${isSystem ? 'bg-sage/10 text-sage w-full text-center border border-sage/20 text-xs py-2' : ''}
                  ${isUser ? 'bg-deep-sage text-dark rounded-br-none' : ''}
                  ${!isUser && !isSystem ? 'bg-[#1a2c2e] text-slate-200 border border-slate-700/30 rounded-bl-none' : ''}
              `}>
                    {msg.text}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="w-[360px] md:w-[400px] h-[600px] max-h-[80vh] bg-[#0d1617]/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-200 mb-4 origin-bottom-right">

                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-800/50 bg-[#070d0e]/50">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-sage'}`}></div>
                            <span className="font-serif font-semibold text-ink">{uiText.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={clearHistory}
                                title="Borrar historial"
                                className="text-muted hover:text-red-400 transition-colors p-1"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                            </button>
                            <button onClick={() => setIsOpen(false)} className="text-muted hover:text-ink transition-colors p-1">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {messages.map(renderMessage)}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-[#070d0e]/80 border-t border-slate-800/50">
                        {isLive ? (
                            <div className="flex items-center justify-between gap-4 h-14">
                                <div className="flex-1 flex items-center gap-2 pl-2">
                                    {/* Visualizer Bars */}
                                    <div className="flex items-end gap-1 h-8">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-1.5 bg-sage rounded-full transition-all duration-75"
                                                style={{ height: `${Math.max(4, volume * 100 * (Math.random() * 0.5 + 0.5))}px` }}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-sage animate-pulse ml-2">{uiText.listening}</span>
                                </div>
                                <button
                                    onClick={stopLiveSession}
                                    className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                                    placeholder={uiText.placeholder}
                                    className="flex-1 bg-[#1a2c2e] text-slate-200 text-sm rounded-full px-4 py-3 focus:outline-none focus:ring-1 focus:ring-sage/50 placeholder:text-muted/50"
                                    disabled={isProcessingText}
                                />
                                <button
                                    onClick={handleSendText}
                                    disabled={!inputText.trim() || isProcessingText}
                                    className="p-3 text-sage hover:bg-sage/10 rounded-full transition-colors disabled:opacity-50"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                                </button>
                                <button
                                    onClick={startLiveSession}
                                    className="p-3 bg-sage text-dark rounded-full hover:bg-deep-sage transition-colors shadow-lg hover:shadow-sage/20"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Toggle Button (Launcher) */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 rounded-full bg-deep-sage text-dark flex items-center justify-center shadow-2xl hover:scale-105 hover:bg-sage transition-all duration-300"
                >
                    <svg width="28" height="28" viewBox="0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            )}
        </div>
    );
};

export default VoiceAssistant;