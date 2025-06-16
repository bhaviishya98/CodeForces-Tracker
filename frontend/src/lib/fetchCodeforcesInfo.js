export async function fetchCodeforcesInfo(handle) {
  try {
    const res = await fetch(
      `https://codeforces.com/api/user.info?handles=${handle}`
    );
    const data = await res.json();

    console.log("CF Fetch Data:", data);

    if (data.status !== "OK") throw new Error("Invalid handle");

    const user = data.result[0];

    const lastOnline = user.lastOnlineTimeSeconds;
    const { streak, status } = calculateStreakAndStatus(lastOnline);


    return {
      handle: user.handle || "",
      rating: user.rating || 1200,
      maxRating: user.maxRating || 1200,
      rank: user.rank || "unrated",
      maxRank: user.maxRank || "unrated",
      contribution: user.contribution || 0,
      organization: user.organization || "",
      friendOfCount: user.friendOfCount || 0,
      lastOnlineTimeSeconds: user.lastOnlineTimeSeconds,
      registrationTimeSeconds: user.registrationTimeSeconds,
      avatar: user.avatar || "",
      titlePhoto: user.titlePhoto || "",
      streak,
      status,
    };
  } catch (err) {
    console.error("CF Fetch Error:", err);
    return {
      handle,
      rating: 1200,
      maxRating: 1200,
      rank: "unrated",
      maxRank: "unrated",
      contribution: 0,
      organization: "",
      friendOfCount: 0,
      lastOnlineTimeSeconds: 0,
      registrationTimeSeconds: 0,
      avatar: "",
      titlePhoto: "",
      streak: 0,
      status: "inactive",
    };
  }
}
function calculateStreakAndStatus(lastOnlineSeconds) {
  const lastOnline = new Date(lastOnlineSeconds * 1000);
  const today = new Date();

  const diffInDays = Math.floor((today - lastOnline) / (1000 * 60 * 60 * 24));

  const streak = lastOnline.toDateString() === today.toDateString() ? 1 : 0;
  const status = diffInDays > 7 ? "inactive" : "active";

  return { streak, status };
}
