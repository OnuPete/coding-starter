// Feel free to modify this!

export type Vote = "upvote" | "downvote";
// userId : submission : vote

export type SubmissionVotes = {
  id: string;
  userId: string;
  submissionId: string;
  vote: Vote;
};

export type O = Array<SubmissionVotes>;
