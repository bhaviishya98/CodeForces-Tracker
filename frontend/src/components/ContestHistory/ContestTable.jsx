const ContestTable = ({ contests = [] }) => {
  if (!contests.length) {
    return (
      <div className="text-center text-muted-foreground mt-4">
        No contest data available.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      {/* Desktop Table */}
      <table className="hidden md:table w-full text-sm text-left">
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

      {/* Mobile View */}
      <div className="flex flex-col gap-4 md:hidden">
        {contests.map((c, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-4 text-sm bg-background"
          >
            <div>
              <strong>Contest Id:</strong> {c.contestId}
            </div>
            <div>
              <strong>Contest:</strong> {c.contestName}
            </div>
            <div>
              <strong>Rank:</strong> {c.rank}
            </div>
            <div>
              <strong>Old Rating:</strong> {c.oldRating}
            </div>
            <div>
              <strong>New Rating:</strong> {c.newRating}
            </div>
            <div>
              <strong>Change:</strong> {c.newRating - c.oldRating}
            </div>
            <div>
              <strong>Unsolved:</strong> {c.unsolvedProblems || "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestTable;
