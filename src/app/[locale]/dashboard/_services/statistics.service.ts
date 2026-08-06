
export const StatisticsService = async (): Promise<StatisticsResponse> => {


    const res = await fetch(`/api/statistics`);

    if (!res.ok) {
        const errorDetail = await res.json().catch(() => ({}));
        throw new Error("Failed to fetch statistics");
    }

    return res.json();
};