import cron from "node-cron";
import { User, Board, Node, Connection, NodeType } from "./models/index.js";

cron.schedule("0 0 1 * *", async () => {
    try {
        // 1. Find all guest users and grab just their IDs
        const guests = await User.find({ role: "guest" }).select("_id");
        const guestIds = guests.map(guest => guest._id);

        if (guestIds.length === 0) return;

        // 2. Find all boards belonging to those guests
        const boards = await Board.find({ userId: { $in: guestIds } }).select("_id");
        const boardIds = boards.map(board => board._id);

        // 3. Delete all related data in bulk using the board IDs
        if (boardIds.length > 0) {
            await Promise.all([
                Node.deleteMany({ boardId: { $in: boardIds } }),
                Connection.deleteMany({ boardId: { $in: boardIds } }),
                NodeType.deleteMany({ boardId: { $in: boardIds } })
            ]);

            // 4. Delete the boards
            await Board.deleteMany({ _id: { $in: boardIds } });
        }

        // 5. Finally, delete the guest users
        await User.deleteMany({ _id: { $in: guestIds } });

        console.log(`Successfully deleted ${guestIds.length} guest users and all their data.`);
    } catch (error) {
        console.error("Error running guest deletion cron job:", error);
    }
});
