// frontend/src/services/api.ts

const API_BASE_URL = 'http://localhost:3000/api/v1';

// Replace this with the exact User UID you used in Postman!
export const MOCK_USER_ID = "7622df75-5bde-42f9-b2d3-aaa69d13e506"; 

export const fetchFootprintHistory = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/footprint/history/${userId}`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const json = await response.json();
    return json.data; // This returns the array of logs
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
};

export const logDailyFootprint = async (userId: string, activityData: {
  commuteMode?: string;
  commuteDistanceKm?: number;
  mealType?: string;
  energyKwh?: number;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/footprint/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, ...activityData }),
    });

    if (!response.ok) throw new Error('Failed to log activity');
    return await response.json();
  } catch (error) {
    console.error("Error logging activity:", error);
    return { success: false, message: "Server connection failed" };
  }
};

