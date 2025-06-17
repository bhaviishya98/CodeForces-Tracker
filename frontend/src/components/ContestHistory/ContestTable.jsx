const ContestTable = ({ contests = [] }) => {

  if (!contests.length) {
    return (
      <div className="text-center text-muted-foreground mt-4">
        No contest data available.
      </div>
    );
  }

  return (
    <table className="w-full text-sm text-left">
      <thead>
        <tr className="text-muted-foreground border-b">
          <th className="py-2 px-4">Contest Id</th>
          <th className="py-2 px-4">Contest</th>
          <th className="py-2 px-4">Rank</th>
          <th className="py-2 px-4">Old Rating</th>
          <th className="py-2 px-4">New Rating</th>
          <th className="py-2 px-4">Change</th>
          <th className="py-2 px-4">Unsolved Problems</th>
        </tr>
      </thead>
      <tbody>
        {contests.map((c, idx) => (
          <tr key={idx} className="border-b">
            <td className="py-2 px-4">{c.contestId}</td>
            <td className="py-2 px-4">{c.contestName}</td>
            <td className="py-2 px-4">{c.rank}</td>
            <td className="py-2 px-4">{c.oldRating}</td>
            <td className="py-2 px-4">{c.newRating}</td>
            <td className="py-2 px-4">{c.newRating - c.oldRating}</td>
            <td className="py-2 px-4">{c.unsolvedProblems || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContestTable;
