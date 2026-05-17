import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type, Chat, GenerateContentResponse, Part } from '@google/genai';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '../utils/audioUtils';
import { SAGEPOINT_INFO } from '../constants';
import { submitToGoogleSheet, fetchKnowledgeBase, FAQItem } from '../utils/sheetUtils';

const API_KEY = process.env.API_KEY || '';
const LIVE_MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025';
const CHAT_MODEL = 'gemini-2.5-flash';
const STORAGE_KEY = 'sagepoint_chat_history';
const GREETING_DISMISSED_KEY = 'sagepoint_greeting_dismissed';

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

/* ── Injected keyframe animations ── */
const STYLE_ID = 'sage-widget-keyframes';
function injectStyles() {
    if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
        @keyframes sage-bobIn{0%{opacity:0;transform:translateY(12px) scale(.92)}60%{transform:translateY(-3px) scale(1.02)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes sage-scaleIn{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
        @keyframes sage-chipIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sage-badgePop{0%{transform:scale(0)}70%{transform:scale(1.25)}100%{transform:scale(1)}}
        @keyframes sage-ringPulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(2);opacity:0}}
        @keyframes sage-fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes sage-msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sage-typingDot{0%,80%,100%{opacity:.25;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}
    `;
    document.head.appendChild(s);
}

const C = {
    ink:    '#f4f7f6',
    slate:  '#d1ddda',
    muted:  '#8b9c99',
    sage:   '#7bd6b4',
    deep:   '#2fb094',
    copper: '#f3b56b',
    dark:   '#0f1b1d',
    abyss:  '#070d0e',
    card:   '#0f191b',
    chat:   '#1a2c2e',
};

const SI = { fill: 'none' as const, stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

function SparkIcon({ s = 18 }: { s?: number }) {
    return (
        <svg width={s} height={s} viewBox="0 0 24 24" {...SI}>
            <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" />
        </svg>
    );
}

function TypingDots() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '10px 14px', background: C.chat, borderRadius: '14px 14px 14px 4px', border: `1px solid ${C.ink}10`, width: 'fit-content' }}>
            {[0, 160, 320].map(d => (
                <span key={d} style={{ width: 7, height: 7, borderRadius: '50%', background: C.sage, display: 'block', animation: `sage-typingDot 1.2s ease-in-out ${d}ms infinite` }} />
            ))}
        </div>
    );
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ lang }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLive, setIsLive] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [volume, setVolume] = useState(0);
    const [knowledgeBase, setKnowledgeBase] = useState<string>('');
    const [greeting, setGreeting] = useState(false);

    useEffect(() => {
        injectStyles();
        if (typeof window !== 'undefined' && sessionStorage.getItem(GREETING_DISMISSED_KEY) === '1') {
            return;
        }
        const t = setTimeout(() => setGreeting(true), 2800);
        return () => clearTimeout(t);
    }, []);

    const dismissGreeting = useCallback(() => {
        setGreeting(false);
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(GREETING_DISMISSED_KEY, '1');
        }
    }, []);

    const uiText = {
        title: lang === 'es' ? 'Asistente Sage' : 'Sage Assistant',
        listening: lang === 'es' ? 'Escuchando...' : 'Listening...',
        placeholder: lang === 'es' ? 'Escribe un mensaje...' : 'Type a message...',
        init: lang === 'es' ? 'Hola, soy Sage. ¿En qué puedo ayudarte hoy con respecto a Sagepoint Analytics?' : 'Hi, I am Sage. How can I help you today regarding Sagepoint Analytics?',
        error: lang === 'es' ? 'Lo siento, hubo un error.' : 'Sorry, there was an error.',
        saved: lang === 'es' ? '📅 Cita agendada: ' : '📅 Appointment scheduled: ',
        sheets: lang === 'es' ? ' (Guardado en Sheets)' : ' (Saved to Sheets)',
        micError: lang === 'es' ? 'Error: No se pudo acceder al micrófono.' : 'Error: Could not access microphone.',
        greetingMsg: lang === 'es'
            ? 'Hola 👋 Soy Sage. ¿Buscas un plan o quieres agendar una consulta gratuita?'
            : 'Hi 👋 I\'m Sage. Looking for a plan or want to book a free consultation?',
        quickReplies: lang === 'es'
            ? ['Ver planes', 'Agendar demo', 'Hablar en español']
            : ['View plans', 'Schedule demo', 'Talk in English'],
        heroTitle: lang === 'es' ? '¿Qué quieres resolver con tus datos hoy?' : 'What do you want to solve with your data today?',
        heroSub: lang === 'es'
            ? 'Respondo en español e inglés. Puedo agendar tu consultoría gratuita en 30 segundos.'
            : 'I answer in Spanish and English. I can schedule your free consultation in 30 seconds.',
        heroFree: lang === 'es' ? 'gratuita' : 'free',
        mostAsked: lang === 'es' ? 'Lo más preguntado' : 'Most asked',
        chips: lang === 'es'
            ? [
                { t: 'Comparar los 3 planes', s: '$300 · $600 · Custom', primary: false },
                { t: 'Automatizar reportes Excel', s: 'Reducción del 80%', primary: false },
                { t: '¿Cuánto tarda la implementación?', s: 'Timeline típico', primary: false },
                { t: 'Agendar consultoría gratuita', s: '30 min con un experto', primary: true },
            ]
            : [
                { t: 'Compare the 3 plans', s: '$300 · $600 · Custom', primary: false },
                { t: 'Automate Excel reports', s: '80% time reduction', primary: false },
                { t: 'How long does implementation take?', s: 'Typical timeline', primary: false },
                { t: 'Schedule a free consultation', s: '30 min with an expert', primary: true },
            ],
        poweredBy: lang === 'es' ? 'Impulsado por Gemini · Tu historial queda guardado' : 'Powered by Gemini · Your history is saved',
        online: lang === 'es' ? 'en línea' : 'online',
    };

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

    useEffect(() => {
        const loadData = async () => {
            const faqs = await fetchKnowledgeBase();
            if (faqs && faqs.length > 0) {
                const faqText = faqs.map((f: FAQItem) => `P: ${f.question}\nR: ${f.answer}`).join('\n\n');
                setKnowledgeBase(faqText);
                chatClientRef.current = null;
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (messages.length === 1 && messages[0].id === 'init') {
            setMessages([{ id: 'init', role: 'model', text: uiText.init }]);
        }
    }, [lang]);

    useEffect(() => {
        chatClientRef.current = null;
    }, [lang]);

    const [inputText, setInputText] = useState("");
    const [isProcessingText, setIsProcessingText] = useState(false);
    const isProcessingTextRef = useRef(false);

    const inputContextRef = useRef<AudioContext | null>(null);
    const outputContextRef = useRef<AudioContext | null>(null);
    const inputProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const outputNodeRef = useRef<GainNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const activeSessionRef = useRef<any>(null);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);
    const chatClientRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const currentTranscriptionRef = useRef<{ user: string, model: string }>({ user: '', model: '' });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    const clearHistory = () => {
        const initialMsg: Message = { id: Date.now().toString(), role: 'model', text: uiText.init };
        setMessages([initialMsg]);
        localStorage.removeItem(STORAGE_KEY);
    };

    const cleanupAudio = useCallback(() => {
        const userPending = currentTranscriptionRef.current.user.trim();
        const modelPending = currentTranscriptionRef.current.model.trim();

        if (userPending || modelPending) {
            const newMessages: Message[] = [];
            if (userPending) newMessages.push({ id: Date.now().toString() + 'u', role: 'user', text: userPending });
            if (modelPending) newMessages.push({ id: Date.now().toString() + 'm', role: 'model', text: modelPending });
            if (newMessages.length > 0) setMessages(prev => [...prev, ...newMessages]);
            if (userPending && modelPending) {
                submitToGoogleSheet({ type: 'Chat Log (Voice - Partial)', question: userPending, answer: modelPending });
            }
        }
        currentTranscriptionRef.current = { user: '', model: '' };

        sourcesRef.current.forEach(source => { try { source.stop(); } catch (e) { } });
        sourcesRef.current.clear();

        if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null; }
        if (inputProcessorRef.current) { inputProcessorRef.current.disconnect(); inputProcessorRef.current = null; }
        if (activeSessionRef.current) { try { activeSessionRef.current.close(); } catch (e) { } activeSessionRef.current = null; }

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
        if (knowledgeBase) instructions += `\n\nPREGUNTAS FRECUENTES (Úsalas para responder con precisión):\n${knowledgeBase}`;
        instructions += `\n\nTu idioma principal es: ${lang === 'es' ? 'ESPAÑOL' : 'INGLÉS'}. ${lang === 'en' ? 'Answer all questions in English.' : 'Responde todas las preguntas en Español.'}`;
        return instructions;
    };

    const sendMessageToAI = async (text: string) => {
        if (isProcessingTextRef.current) return;
        isProcessingTextRef.current = true;
        setIsProcessingText(true);
        const userMsgId = Date.now().toString();
        setMessages(prev => {
            const filtered = prev.filter(m => m.id !== 'init');
            return [...filtered, { id: userMsgId, role: 'user', text }];
        });

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

            while (response.functionCalls && response.functionCalls.length > 0) {
                const functionResponses = await Promise.all(response.functionCalls.map(async (fc) => {
                    const { name, args } = fc;
                    let result = { result: 'Error executing tool' };
                    if (name === 'scheduleAppointment') {
                        const { name: uName, email, date, time } = args as any;
                        const success = await submitToGoogleSheet({ name: uName, email, date, time, type: 'Cita Consultoría (Voz/Chat)' });
                        if (success) {
                            result = { result: `Success: Appointment scheduled for ${uName} on ${date} at ${time}` };
                            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: `${uiText.saved}${date} ${time}${uiText.sheets}` }]);
                        } else {
                            result = { result: `Failed to save to calendar system` };
                        }
                    }
                    return { id: fc.id, name: fc.name, response: result };
                }));
                const parts: Part[] = functionResponses.map(resp => ({ functionResponse: resp }));
                response = await chat.sendMessage({ message: parts });
            }

            const modelText = response.text;
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: modelText }]);
            if (modelText) submitToGoogleSheet({ type: 'Chat Log (Text)', question: text, answer: modelText });
        } catch (error) {
            console.error("Chat Error", error);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: uiText.error }]);
        } finally {
            isProcessingTextRef.current = false;
            setIsProcessingText(false);
        }
    };

    const handleSendText = async () => {
        if (!inputText.trim() || isProcessingTextRef.current) return;
        const text = inputText;
        setInputText("");
        await sendMessageToAI(text);
    };

    const handleChipClick = async (text: string) => {
        if (isProcessingTextRef.current) return;
        setIsOpen(true);
        dismissGreeting();
        await sendMessageToAI(text);
    };

    const startLiveSession = async () => {
        if (isLive || isConnecting) return;
        setIsConnecting(true);

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("Microphone access not supported");

            const ai = new GoogleGenAI({ apiKey: API_KEY });
            inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
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
                    systemInstruction: getSystemInstruction(),
                    tools: TOOLS,
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
                callbacks: {
                    onopen: () => {
                        setIsConnecting(false);
                        setIsLive(true);
                        if (!inputContextRef.current) return;
                        const source = inputContextRef.current.createMediaStreamSource(stream);
                        const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
                        inputProcessorRef.current = processor;
                        processor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
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

                        if (msg.toolCall) {
                             const responses = await Promise.all(msg.toolCall.functionCalls.map(async (fc) => {
                                 let result = { result: 'Error' };
                                 if (fc.name === 'scheduleAppointment') {
                                     const { name, email, date, time } = fc.args as any;
                                     const success = await submitToGoogleSheet({ name, email, date, time, type: 'Cita Consultoría (Voz/Chat)' });
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

                        const outTrans = msg.serverContent?.outputTranscription;
                        const inTrans = msg.serverContent?.inputTranscription;
                        const turnComplete = msg.serverContent?.turnComplete;

                        if (inTrans) currentTranscriptionRef.current.user += inTrans.text;
                        if (outTrans) currentTranscriptionRef.current.model += outTrans.text;

                        if (turnComplete) {
                            const userT = currentTranscriptionRef.current.user.trim();
                            const modelT = currentTranscriptionRef.current.model.trim();
                            if (userT) setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userT }]);
                            if (modelT) setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: modelT }]);
                            if (userT && modelT) submitToGoogleSheet({ type: 'Chat Log (Voice)', question: userT, answer: modelT });
                            currentTranscriptionRef.current.user = '';
                            currentTranscriptionRef.current.model = '';
                        }
                    },
                    onclose: () => cleanupAudio(),
                    onerror: (err) => { console.error("Live Session Error:", err); cleanupAudio(); }
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

    const stopLiveSession = () => cleanupAudio();
    const toggleLive = () => { if (isLive) stopLiveSession(); else startLiveSession(); };

    const isWelcome = messages.length === 1 && messages[0].id === 'init';

    const renderMessage = (msg: Message) => {
        const isUser = msg.role === 'user';
        const isSystem = msg.role === 'system';
        return (
            <div key={msg.id} style={{
                display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
                marginBottom: 10, animation: 'sage-msgIn 350ms cubic-bezier(0.22,1,0.36,1) both',
            }}>
                <div style={{
                    maxWidth: '85%', padding: '11px 14px', lineHeight: 1.55,
                    fontSize: isSystem ? 12 : 13.5,
                    background: isSystem ? `${C.sage}18` : isUser ? C.deep : C.chat,
                    color: isSystem ? C.sage : isUser ? C.dark : C.slate,
                    borderRadius: isSystem ? 10 : isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    border: isSystem ? `1px solid ${C.sage}30` : isUser ? `1px solid ${C.deep}` : `1px solid ${C.ink}10`,
                    fontWeight: isUser ? 500 : 400,
                    width: isSystem ? '100%' : undefined,
                    textAlign: isSystem ? 'center' : undefined,
                } as React.CSSProperties}>{msg.text}</div>
            </div>
        );
    };

    /* ── Welcome Screen ── */
    const WelcomeScreen = () => (
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px 12px' }}>
            <div style={{
                padding: '18px 18px 16px', borderRadius: 16, marginBottom: 16,
                background: `linear-gradient(135deg, rgba(47,176,148,0.13), rgba(243,181,107,0.06))`,
                border: `1px solid ${C.deep}30`,
                animation: 'sage-scaleIn 420ms cubic-bezier(0.22,1,0.36,1) both',
            }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.sage, marginBottom: 8 }}>
                    {lang === 'es' ? 'Hola, soy Sage' : 'Hi, I\'m Sage'}
                </div>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, color: C.ink, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                    {uiText.heroTitle}
                </div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 8, lineHeight: 1.55 }}>
                    {lang === 'es'
                        ? <>Respondo en español e inglés. Puedo agendar tu consultoría{' '}<span style={{ color: C.sage, fontWeight: 600 }}>gratuita</span> en 30 segundos.</>
                        : <>I answer in Spanish and English. I can schedule your{' '}<span style={{ color: C.sage, fontWeight: 600 }}>free</span> consultation in 30 seconds.</>
                    }
                </div>
            </div>

            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, marginBottom: 8 }}>
                {uiText.mostAsked}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {uiText.chips.map((chip, i) => (
                    <button key={i} onClick={() => handleChipClick(chip.t)} style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px',
                        background: chip.primary ? C.deep : C.chat,
                        color: chip.primary ? C.dark : C.slate,
                        border: `1px solid ${chip.primary ? C.deep : C.ink + '10'}`,
                        borderRadius: 13, textAlign: 'left', width: '100%', cursor: 'pointer',
                        fontFamily: 'inherit',
                        animation: `sage-chipIn 350ms cubic-bezier(0.22,1,0.36,1) ${80 + i * 60}ms both`,
                        transition: 'filter 120ms, transform 120ms',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(1.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.filter = 'none'; }}
                    >
                        <span style={{
                            width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                            background: chip.primary ? 'rgba(7,13,14,0.2)' : `${C.sage}18`,
                            color: chip.primary ? C.dark : C.sage,
                            display: 'flex', alignItems: 'center', justifycontent: 'center', fontSize: 12,
                        }}>→</span>
                        <span style={{ flex: 1 }}>
                            <span style={{ display: 'block', fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{chip.t}</span>
                            <span style={{ display: 'block', fontSize: 11, opacity: chip.primary ? 0.7 : 0.55, marginTop: 2 }}>{chip.s}</span>
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );

    /* ── Panel header ── */
    const PanelHeader = () => (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px',
            background: `linear-gradient(180deg, rgba(47,176,148,0.10), rgba(47,176,148,0.0))`,
            borderBottom: `1px solid ${C.ink}10`, flexShrink: 0,
        }}>
            <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: `linear-gradient(135deg, ${C.sage}, ${C.deep})`,
                color: C.abyss, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 14px ${C.deep}55`, position: 'relative',
            }}>
                <SparkIcon s={17} />
                <span style={{ position: 'absolute', right: -2, bottom: -2, width: 11, height: 11, borderRadius: '50%', background: isLive ? '#f87171' : C.sage, border: `2px solid ${C.abyss}`, ...(isLive ? { animation: 'pulse 1s infinite' } : {}) }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 600, color: C.ink, lineHeight: 1.1 }}>Sage</div>
                <div style={{ fontSize: 10.5, color: C.muted, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{lang === 'es' ? 'Inteligencia de negocios' : 'Business intelligence'}</span>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span style={{ color: C.sage }}>ES / EN</span>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <button onClick={clearHistory} title={lang === 'es' ? 'Borrar historial' : 'Clear history'} style={{
                    width: 30, height: 30, borderRadius: 8, background: 'transparent', color: C.muted,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer',
                    transition: 'color 150ms, background 150ms',
                }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.background = 'transparent'; }}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                </button>
                <button onClick={() => setIsOpen(false)} style={{
                    width: 30, height: 30, borderRadius: 8, background: 'transparent', color: C.muted,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer',
                    transition: 'color 150ms, background 150ms',
                }}
                    onMouseEnter={e => { e.currentTarget.style.color = C.ink; e.currentTarget.style.background = `${C.ink}12`; }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.background = 'transparent'; }}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 50, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>

            {/* Chat Panel */}
            {isOpen && (
                <div style={{
                    position: 'absolute', right: 16, bottom: 88, width: 'min(420px, calc(100vw - 32px))',
                    maxHeight: 'min(600px, 80vh)',
                    background: `linear-gradient(180deg, ${C.card} 0%, #0d1b1c 100%)`,
                    borderRadius: 22, border: `1px solid ${C.ink}12`,
                    boxShadow: `0 32px 80px rgba(2,6,7,0.72), 0 0 0 1px ${C.ink}06, inset 0 1px 0 rgba(255,255,255,0.05)`,
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    animation: 'sage-scaleIn 320ms cubic-bezier(0.22,1,0.36,1) both',
                    transformOrigin: 'bottom right',
                }}>
                    <PanelHeader />

                    {/* Messages / Welcome */}
                    {isWelcome ? (
                        <WelcomeScreen />
                    ) : (
                        <div ref={el => { if (el) el.scrollTop = el.scrollHeight; }} style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 12px' }}>
                            {messages.filter(m => m.id !== 'init').map(renderMessage)}
                            {isProcessingText && (
                                <div style={{ animation: 'sage-msgIn 300ms ease both' }}><TypingDots /></div>
                            )}
                            {isLive && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: C.chat, borderRadius: 10, marginBottom: 8, border: `1px solid ${C.ink}10` }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 20 }}>
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} style={{ width: 3, borderRadius: 2, background: C.sage, transition: 'height 75ms', height: `${Math.max(4, volume * 80 * (Math.random() * 0.5 + 0.5))}px` }} />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: 12, color: C.sage }}>{uiText.listening}</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}

                    {/* Composer */}
                    <div style={{ padding: '10px 12px 12px', borderTop: `1px solid ${C.ink}10`, background: C.abyss, flexShrink: 0 }}>
                        {isLive ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, height: 56 }}>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 32 }}>
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} style={{ width: 6, borderRadius: 3, background: C.sage, transition: 'height 75ms', height: `${Math.max(4, volume * 100 * (Math.random() * 0.5 + 0.5))}px` }} />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: 13, color: C.sage, marginLeft: 4 }}>{uiText.listening}</span>
                                </div>
                                <button onClick={stopLiveSession} style={{
                                    width: 40, height: 40, borderRadius: '50%', background: 'rgba(239,68,68,0.15)', color: '#f87171',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer',
                                    transition: 'background 150ms',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: C.chat, borderRadius: 9999, padding: '5px 5px 5px 14px', border: `1px solid ${C.ink}10` }}>
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={e => setInputText(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') handleSendText(); }}
                                    placeholder={uiText.placeholder}
                                    disabled={isProcessingText}
                                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: C.slate, fontSize: 13, fontFamily: 'inherit' }}
                                />
                                <button onClick={handleSendText} disabled={!inputText.trim() || isProcessingText} style={{
                                    width: 30, height: 30, borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer',
                                    color: inputText.trim() && !isProcessingText ? C.sage : C.muted,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 150ms',
                                }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                                </button>
                                <button onClick={startLiveSession} disabled={isConnecting} style={{
                                    width: 34, height: 34, borderRadius: '50%', background: C.deep, color: C.dark,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer',
                                    opacity: isConnecting ? 0.6 : 1,
                                }}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                                </button>
                            </div>
                        )}
                        <div style={{ textAlign: 'center', fontSize: 9.5, color: C.muted, opacity: 0.5, marginTop: 7 }}>{uiText.poweredBy}</div>
                    </div>
                </div>
            )}

            {/* Launcher area */}
            <div style={{ position: 'absolute', right: 16, bottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14 }}>

                {/* Greeting bubble */}
                {greeting && !isOpen && (
                    <div style={{
                        width: 'min(310px, calc(100vw - 32px))', background: C.card, borderRadius: '14px 14px 4px 14px',
                        border: `1px solid ${C.deep}40`, padding: '11px 14px 10px',
                        boxShadow: `0 20px 44px rgba(2,6,7,0.60), inset 0 1px 0 rgba(255,255,255,0.04)`,
                        animation: 'sage-bobIn 560ms cubic-bezier(0.22,1,0.36,1) both',
                        position: 'relative',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.sage, boxShadow: `0 0 8px ${C.sage}` }} />
                            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 600, color: C.ink }}>Sage</span>
                            <span style={{ fontSize: 10, color: C.muted, marginLeft: 'auto' }}>{uiText.online}</span>
                        </div>
                        <div style={{ fontSize: 12.5, lineHeight: 1.45, color: C.slate }}>
                            {lang === 'es'
                                ? <>Hola 👋 Soy Sage. ¿Buscas un plan o quieres agendar una consulta <strong style={{ color: C.sage }}>gratuita</strong>?</>
                                : <>Hi 👋 I'm Sage. Looking for a plan or want to book a <strong style={{ color: C.sage }}>free</strong> consultation?</>
                            }
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 9 }}>
                            {uiText.quickReplies.map(t => (
                                <button key={t} onClick={() => handleChipClick(t)} style={{
                                    fontSize: 11, padding: '4px 10px', borderRadius: 9999,
                                    background: `${C.sage}14`, color: C.sage,
                                    border: `1px solid ${C.sage}35`, cursor: 'pointer', fontFamily: 'inherit',
                                    transition: 'background 120ms',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = `${C.sage}28`}
                                    onMouseLeave={e => e.currentTarget.style.background = `${C.sage}14`}
                                >{t}</button>
                            ))}
                        </div>
                        <button onClick={dismissGreeting} style={{
                            position: 'absolute', top: -7, right: -7, width: 22, height: 22, borderRadius: '50%',
                            background: C.abyss, color: C.muted, border: `1px solid ${C.muted}30`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, cursor: 'pointer', lineHeight: 1,
                        }} aria-label={lang === 'es' ? 'Cerrar saludo' : 'Dismiss'}>×</button>
                    </div>
                )}

                {/* FAB */}
                <FABButton isOpen={isOpen} hasGreeting={greeting} onToggle={() => { setIsOpen(o => !o); dismissGreeting(); }} />
            </div>
        </div>
    );
};

function FABButton({ isOpen, hasGreeting, onToggle }: { isOpen: boolean; hasGreeting: boolean; onToggle: () => void }) {
    const [hover, setHover] = useState(false);

    return (
        <button
            onClick={onToggle}
            aria-label="Abrir Sage"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                position: 'relative', width: 62, height: 62, borderRadius: '50%',
                background: isOpen
                    ? `linear-gradient(135deg, ${C.sage}, ${C.deep})`
                    : C.deep,
                color: C.abyss, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 20px 44px rgba(2,6,7,0.60), 0 0 ${hover ? '28px 6px' : '18px 2px'} ${C.deep}55, inset 0 2px 0 rgba(255,255,255,0.12)`,
                transition: 'all 250ms cubic-bezier(0.22,1,0.36,1)',
                transform: hover ? 'scale(1.07) translateY(-2px)' : 'scale(1)',
            }}
        >
            {/* Pulsing ring */}
            {!isOpen && (
                <span style={{
                    position: 'absolute', inset: -6, borderRadius: '50%',
                    border: `2px solid ${C.sage}55`,
                    animation: 'sage-ringPulse 2.6s ease-out infinite',
                    pointerEvents: 'none',
                }} />
            )}
            {/* Unread badge */}
            {hasGreeting && !isOpen && (
                <span style={{
                    position: 'absolute', top: 2, right: 2, width: 15, height: 15, borderRadius: '50%',
                    background: C.copper, color: C.abyss, fontSize: 9, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `2px solid ${C.abyss}`,
                    animation: 'sage-badgePop 400ms cubic-bezier(0.34,1.56,0.64,1) 1.2s both',
                }}>1</span>
            )}
            {isOpen
                ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            }
        </button>
    );
}

export default VoiceAssistant;
