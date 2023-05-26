import React from 'react';

export default function Rules({ boards }) {
  return (
    <div className="rules">
      <div className="global-rules">
        <h1>Global Rules</h1>
        <ol>
          <li>
            You will not upload, post, discuss, request, or link to anything
            that violates local or United States law.
          </li>
          <li>
            You will immediately cease and not continue to access the site if
            you are under the age of 18.
          </li>
          <li>
            All boards on Cheddit are to be considered &quot;work safe.&quot; Do
            not post anything that would be unacceptable in a professional
            setting.
          </li>
          <li>
            You will not post or request personal information (&quot;dox&quot;)
            or calls to invasion (&quot;raids&quot;). Inciting or participating
            in cross-board (intra-Cheddit) raids is also not permitted.
          </li>
          <li>No spamming or flooding of any kind. </li>
          <li>
            Advertising (all forms) is not welcome—this includes any type of
            referral linking, &quot;offers&quot;, soliciting, begging, stream
            threads, etc.
          </li>
        </ol>
        <p>
          These rules apply to all boards. Individual boards may have additional
          rules that are more strict, but none can violate any global rule.
        </p>
        <p>
          Remember: The use of Cheddit is a privilege, not a right. The site
          admin reserves the right to revoke access and remove content for any
          reason without notice.
        </p>
      </div>
      <div className="per-board-rules">
        <h1>Per-Board Rules</h1>
        {boards.map((board) => (
          <div key={`${board.id}-rules`}>
            <h2>{`/${board.id}/ - ${board.name}`}</h2>
            {board.rules.length ? (
              <ol>
                {board.rules.map((rule) => (
                  <li key={`${board.id}-rule#${rule.id}`}>
                    {rule.rule}
                  </li>
                ))}
              </ol>
            ) : (
              <ol>
                <li>No additional rules - global rules still apply.</li>
              </ol>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
