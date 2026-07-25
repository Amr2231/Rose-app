"use client";
import { useQuery } from "@tanstack/react-query";
import { StatisticsService } from "../_services/statistics.service";


// hook
export const useStatistics = () => {
    return useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: StatisticsService ,
    });
};