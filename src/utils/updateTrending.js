import { Query } from "../appwrite/config";
import { tablesDB, DATABASE_ID, TABLE_ID } from "../appwrite/config";

const updateTrendingMovies = async () => {
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.limit(5), Query.orderDesc("count")],
    });
    return result.rows;
  } catch (error) {
    console.error("Error fetching Trending movies from Appwrite:", error);
    throw error;
  }
};

export default updateTrendingMovies;
