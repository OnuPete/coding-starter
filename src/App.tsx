import "css/global/Global.css";

import styles from "css/App.module.css";
import EXAMPLE_SUBMISSIONS, { Submission } from "ExampleSubmissions";
import { useState } from "react";
import { BrowserRouter, Route, Routes as RoutesImport } from "react-router-dom";
import { SubmissionVotes, Vote } from "utils/local-storage/types";
import getObject from "./utils/local-storage/getObject";
import setObject from "./utils/local-storage/setObject";

const Card = ({
  submission,
  onVoteClick,
}: {
  submission: Submission;
  onVoteClick: (submission: Submission, vote: Vote) => void;
}) => (
  <div>
    {submission.name}
    {submission.assets.map((img) => (
      <img src={img.src} alt="" />
    ))}
    <div>
      <button onClick={() => onVoteClick(submission, "downvote")} type="button">
        Downvote
      </button>
      <button onClick={() => onVoteClick(submission, "upvote")} type="button">
        Upvote
      </button>
    </div>
  </div>
);
const AdminCard = ({
  submission,
  onVoteClick,
  submissionVotes,
}: {
  submission: Submission;
  onVoteClick: (submission: Submission, vote: Vote) => void;
  submissionVotes: SubmissionVotes[];
}) => (
  <div>
    {submission.name}
    {submission.assets.map((img) => (
      <img src={img.src} alt="" />
    ))}
    <div>
      <p>
        {submissionVotes.reduce((count, s) => {
          return count + s.vote === "upvote" ? 1 : 0;
        }, 0)}{" "}
        # of Approve
      </p>
      <p>
        {submissionVotes.reduce((count, s) => {
          return count + s.vote === "downvote" ? 1 : 0;
        }, 0)}{" "}
        # of Reject
      </p>
      <button onClick={() => onVoteClick(submission, "upvote")} type="button">
        Approve
      </button>
      <button onClick={() => onVoteClick(submission, "downvote")} type="button">
        reject
      </button>
    </div>
  </div>
);

function VotePage(): JSX.Element {
  const userID = "imuser1";
  const adminId = "admin1";
  const sumbissionsKey = "submissionVotes";
  const approvalsOrRejectionsKey = "approvalsOrRejectionsVotes";
  const [isAdmin, setIsAdmin] = useState(false);
  const randomExample: Submission =
    EXAMPLE_SUBMISSIONS[Math.floor(Math.random() * EXAMPLE_SUBMISSIONS.length)];
  console.log(randomExample);

  const submissionIdsAdmin = (getObject(approvalsOrRejectionsKey) || []).map(
    (s) => s.submissionId
  );
  // find all submissions for curent user
  const submissionIds = (getObject(sumbissionsKey) || [])
    .filter((submission) => submission.userId === userID)
    .map((submission) => submission.submissionId);

  const submissionVotes = getObject(sumbissionsKey) || [];

  // filter out any submissions that current user has voted on
  const currentSubmissions = EXAMPLE_SUBMISSIONS.filter(
    (sumbission) =>
      !submissionIds.includes(sumbission.id) ||
      !submissionIdsAdmin.includes(sumbission.id)
  );
  const [currentSubmissionId, setCurrentSubmissionId] = useState(1);

  // store
  const handleVoteClick = (submission: Submission, vote: Vote) => {
    console.log("click", vote);
    let submissionVotes = getObject(sumbissionsKey) || [];
    const newSubmission = {
      id: `${submissionVotes.length}`,
      userId: userID,
      submissionId: submission.id,
      vote,
    };
    submissionVotes.push(newSubmission);
    setObject(sumbissionsKey, submissionVotes);
    setCurrentSubmissionId(currentSubmissionId + 1);
  };
  // userId : submission : vote

  const handleAdminClick = (submission: Submission, vote: Vote) => {
    const approvalsOrRejections = getObject(approvalsOrRejectionsKey) || [];
    const newSubmission = {
      id: `${submissionVotes.length}`,
      userId: adminId,
      submissionId: submission.id,
      vote,
    };
    approvalsOrRejections.push(newSubmission);
    setObject(sumbissionsKey, approvalsOrRejections);

    setCurrentSubmissionId(currentSubmissionId + 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.example}>
        <h1>Welcome!</h1>
        <button onClick={() => setIsAdmin(!isAdmin)} type="button">
          Admin
        </button>
        {currentSubmissions.length ? (
          isAdmin ? (
            <AdminCard
              submission={currentSubmissions[0]}
              onVoteClick={handleAdminClick}
              submissionVotes={submissionVotes.filter(
                (submssion) =>
                  submssion.submissionId === currentSubmissions[0].id
              )}
            />
          ) : (
            <Card
              submission={currentSubmissions[0]}
              onVoteClick={handleVoteClick}
            />
          )
        ) : (
          "NothingToShow"
        )}
        <div>Good luck!</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <RoutesImport>
        <Route path="/" element={<VotePage />} />
      </RoutesImport>
    </BrowserRouter>
  );
}

export default App;
