import mongodb from "@/lib/mongodb";
import Support from "@/models/Support";

export async function GET() {
  try {
    await mongodb();

    // 1. Clear out any existing data to start fresh
    await Support.deleteMany({});

    // 2. The Dummy Data Array
    const dummyData = [
      {
        name: "Vikram Desai",
        message: "Loved the Braille-to-speech hardware integration! Great use of I2C. Buy yourself a coffee.",
        amount: 500,
        isCompleted: true,
        // Subtracting days so they show up in chronological order
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), 
      },
      {
        name: "Sneha",
        message: "Thanks for sharing your DSA notes with the batch, they really helped.",
        amount: 250,
        isCompleted: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Anonymous",
        message: "The web player UI looks super clean. Keep building cool things!",
        amount: 1000,
        isCompleted: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Aman",
        message: "",
        amount: 150,
        isCompleted: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      }
    ];

    // 3. Insert it all at once
    await Support.insertMany(dummyData);

    return Response.json({ success: true, message: "Database successfully seeded with dummy data!" });

  } catch (error) {
    console.error("Seeding error:", error);
    return Response.json({ success: false, message: "Failed to seed database." }, { status: 500 });
  }
}