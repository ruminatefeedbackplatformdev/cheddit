import React from 'react';
import BoardRules from './BoardRules';

export default function Rules({ boards, user }) {
  return (
    <div className="rules">
      <h1>Global Rules</h1>
      <div className="global-rules">
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
        {boards.map((board) => (
          <BoardRules board={board} key={`${board.id}-rules`} user={user} />
        ))}
      </div>
    </div>
  );
}
