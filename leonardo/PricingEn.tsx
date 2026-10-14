import React from 'react';
import { Link } from 'react-router-dom';

/** English pricing ladder (US prices). The Spanish ladder in LeonardoHome keeps the Guatemala prices. */
export default function PricingEn({
  cta,
  portfolioPath,
}: {
  cta: (id: string, cls: string) => React.ReactNode;
  portfolioPath: string;
}) {
  return (
    <>
      <div className="plist">
        <p className="lstep">
          <span>Step 1</span> Most clients start here
        </p>
        <article className="prow prow--lead spot" data-rv>
          <div className="prow-price">
            <b>$750</b>
            <span>fixed, paid on delivery</span>
          </div>
          <div className="prow-body">
            <h3>14-Day Dashboard Pilot</h3>
            <p className="prow-scope">
              I connect two of your sources, for example QuickBooks and the sales spreadsheet, and build a working
              dashboard with up to eight of your numbers. You also get a one-page list of what is worth automating
              next, in order of payoff.
            </p>
            <ul className="pfacts">
              <li>About 90 minutes of your team's time</li>
              <li>NDA signed before I open a file</li>
              <li>One round of changes</li>
            </ul>
            <p className="pguar">
              <b>If the dashboard isn't useful to you, you don't pay.</b> You only pay the $750 once you've seen it
              working with your own data.
            </p>
            <div className="prow-act">
              {cta('quick-win', 'pill pill--mint')}
              <span className="prow-note">If you continue within 30 days, the $750 comes off the next project.</span>
            </div>
          </div>
        </article>

        <p className="lstep lstep--mid" data-rv>
          <span>Step 2</span> If the pilot shows it's worth it
        </p>
        <article className="prow spot" data-rv>
          <div className="prow-price">
            <b>$3,900</b>
            <span>fixed price, 4 to 6 weeks</span>
          </div>
          <div className="prow-body">
            <h3>Executive Cockpit</h3>
            <p className="prow-scope">
              Up to four sources, up to three dashboards and one report that builds and sends itself every week. Two
              training sessions and written documentation, so your team doesn't depend on me to use it.
            </p>
            <div className="prow-act">
              {cta('executive', 'pill pill--ghost')}
              <span className="prow-note">Not included: a data warehouse or custom forecasting models.</span>
            </div>
          </div>
        </article>

        <article className="prow spot" data-rv>
          <div className="prow-price">
            <b>$15,000+</b>
            <span>10 to 14 weeks</span>
          </div>
          <div className="prow-body">
            <h3>Control Room</h3>
            <p className="prow-scope">
              For businesses running on several systems that don't talk to each other: your own data warehouse, a
              portal with user permissions, forecasting models and CRM or ERP integrations. Scoped and priced in
              writing after the pilot.
            </p>
            <div className="prow-act">{cta('custom', 'pill pill--ghost')}</div>
          </div>
        </article>

        <p className="lstep lstep--mid" data-rv>
          <span>Step 3</span> Optional, after delivery
        </p>
        <article className="prow prow--sm spot" data-rv>
          <div className="prow-price">
            <b>$450+</b>
            <span>per month, cancel any month</span>
          </div>
          <div className="prow-body">
            <h3>Ongoing Support</h3>
            <ul className="ptiers">
              <li>
                <b>$450</b> Keep it running: refresh checks, fixes and small changes.
              </li>
              <li>
                <b>$900</b> Keep improving: the above plus a new view or report each month.
              </li>
              <li>
                <b>$1,800</b> Analyst on call: the above plus a 30-minute review with you every week.
              </li>
            </ul>
            <p className="prow-note">No hour counting: each level covers the work it describes. Pay the year upfront and two months are free.</p>
            <div className="prow-act">{cta('retainer', 'pill pill--ghost')}</div>
          </div>
        </article>
      </div>

      <div className="pnote" data-rv>
        <p>
          <b>Why this costs less than a US agency.</b> I'm one senior analyst in Guatemala City, working Central Time.
          There is no sales team and no US office rent in the price. The tools are the same (Power BI, SQL, Python),
          every number is checked by hand, and you talk to the person doing the work.
        </p>
        <p className="pnote-terms">Projects: 50% to start, 50% on delivery.</p>
        <p className="pnote-sign">Anibal Fuentes</p>
      </div>

      <p className="aside" data-rv>
        Looking for a website or app without the data work? We build those separately.{' '}
        <Link to={portfolioPath}>See the portfolio</Link>.
      </p>
    </>
  );
}
