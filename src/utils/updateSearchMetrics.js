import {
  tablesDB,
  ID,
  DATABASE_ID,
  TABLE_ID,
  Query,
} from "../appwrite/config.js";

export const updateSearchMetrics = async (searchTerm, movie) => {
  try {
    // using appwrite SDK to check if a record for the searchTerm exists in the database
    const response = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.equal("searchTerm", searchTerm)],
    });

    // If record exists, update the count
    if (response.rows.length > 0) {
      const item = response.rows[0];
      await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: item.$id,
        data: {
          count: item.count + 1,
        },
      });
    }
    // else create a new record
    else {
      await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ID.unique(),
        data: {
          searchTerm: searchTerm,
          count: 1,
          movieId: movie.id,
          posterUrl: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};
