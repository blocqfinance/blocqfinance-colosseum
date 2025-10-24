"use client";

import React, { useEffect, useState } from "react";
import styles from "./dashboard.module.scss";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import useAuthStore from "@/store/AuthStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { getDashboard } from "@/libs/api/collections/dashboard";

// Type definitions
interface SummaryData {
    totalLCs: number;
    totalPendingFunding: number;
    totalAwaitingSeller: number;
    totalWithSubmittedDocument: number;
    totalVolumeCompleted: number;
    totalVolumeRefunded: number;
    activeLCs: number;
}

interface AnnualTransaction {
    year: number;
    month: string;
    funded: string | number;
    completed: number;
    refunded: number;
}

interface MonthlyActivity {
    month: string;
    active: number;
    completed: number;
}

interface DashboardStats {
    summary: SummaryData[];
    annualTransactionOverview: AnnualTransaction[];
    monthlyActivities: MonthlyActivity[];
}

interface ChartDataAnnual {
    month: string;
    funded: number;
    completed: number;
    refunded: number;
}

interface ChartDataMonthly {
    month: string;
    active: number;
    completed: number;
}

type MonthMapType = {
    [key: string]: string;
};

const Dashboard = () => {
    const { user } = useAuthStore();
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const { data, error } = useSWR(`dashboard`, getDashboard);

    useEffect(() => {
        const singleData = data?.data as DashboardStats;
        console.log(data?.data);
        setStats(singleData);
    }, [data, error]);

    // Helper function overloads for type safety
    function getAnnualData(apiData: AnnualTransaction[] | undefined): ChartDataAnnual[] {
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const monthMap: MonthMapType = {
            jan: "JAN", feb: "FEB", mar: "MAR", apr: "APR",
            may: "MAY", jun: "JUN", jul: "JUL", aug: "AUG",
            sep: "SEP", oct: "OCT", nov: "NOV", dec: "DEC"
        };

        const dataByMonth: { [key: string]: AnnualTransaction } = {};
        if (apiData && Array.isArray(apiData)) {
            apiData.forEach((item) => {
                const monthKey = monthMap[item.month?.toLowerCase()];
                if (monthKey) {
                    dataByMonth[monthKey] = item;
                }
            });
        }

        return months.map(month => {
            const monthData = dataByMonth[month];
            return {
                month,
                funded: monthData ? Number(monthData.funded) || 0 : 0,
                completed: monthData ? Number(monthData.completed) || 0 : 0,
                refunded: monthData ? Number(monthData.refunded) || 0 : 0
            };
        });
    }

    function getMonthlyData(apiData: MonthlyActivity[] | undefined): ChartDataMonthly[] {
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const monthMap: MonthMapType = {
            jan: "JAN", feb: "FEB", mar: "MAR", apr: "APR",
            may: "MAY", jun: "JUN", jul: "JUL", aug: "AUG",
            sep: "SEP", oct: "OCT", nov: "NOV", dec: "DEC"
        };

        const dataByMonth: { [key: string]: MonthlyActivity } = {};
        if (apiData && Array.isArray(apiData)) {
            apiData.forEach((item) => {
                const monthKey = monthMap[item.month?.toLowerCase()];
                if (monthKey) {
                    dataByMonth[monthKey] = item;
                }
            });
        }

        return months.map(month => {
            const monthData = dataByMonth[month];
            return {
                month,
                active: monthData ? Number(monthData.active) || 0 : 0,
                completed: monthData ? Number(monthData.completed) || 0 : 0
            };
        });
    }

    const annualData = getAnnualData(stats?.annualTransactionOverview);
    const monthlyActivities = getMonthlyData(stats?.monthlyActivities);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <Image width={40} height={40} src='/avee.svg' alt='' />
                    <div className={styles.header_inner}>
                        <h1>{user?.firstName} {user?.lastName}</h1>
                        <p>Welcome back to Blocq Finance 👋🏻</p>
                    </div>
                </div>
                <button onClick={() => router.replace('/dashboard/create')} className={styles.create_lc_button}>
                    Create New LC
                    <span>
                        <Image src="/arrow-top-right.svg" width={9} height={9} alt="" />
                    </span>
                </button>
            </div>
            <div className={styles.dashboard}>
                {/* Left Sidebar */}
                <div className={styles.sidebar}>
                    <div className={styles.sidebar_header}>
                        <Image src="/box.svg" width={24} height={24} alt="" />
                        <h1>Dashboard Overview</h1>
                    </div>
                    <div className={styles.cardOne}>
                        <h4>Total Letter of credit</h4>
                        <p style={{color: '#ffffff'}} className={styles.amount}>{stats?.summary?.[0]?.totalLCs ? stats?.summary?.[0]?.totalLCs : '0'}</p>
                        {/* <span className={styles.positive}>+5%</span> */}
                        <ResponsiveContainer width="100%" height={80}>
                            <LineChart data={monthlyActivities}>
                                <Line type="monotone" dataKey="active" stroke="#8884d8" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className={styles.card}>
                        <div>
                            <Image src="/circle-box.svg" width={40} height={40} alt="lc" />
                        </div>
                        <h4>Total Pending funding</h4>
                        <p className={styles.amount}>{stats?.summary?.[0]?.totalPendingFunding ? stats?.summary?.[0]?.totalPendingFunding : '0'}
                            {/* <span className={styles.negative}>-2%</span> */}
                        </p>
                    </div>

                    <div className={styles.card}>
                        <div>
                            <Image src="/circle-box.svg" width={40} height={40} alt="lc" />
                        </div>
                        <h4>Total Awaiting seller</h4>
                        <p className={styles.amount}>{stats?.summary?.[0]?.totalAwaitingSeller ? stats?.summary?.[0]?.totalAwaitingSeller : '0'}
                            {/* <span className={styles.positive}>+5%</span> */}
                        </p>
                    </div>

                    <div className={styles.card}>
                        <div>
                            <Image src="/circle-arrow-bottom-left.svg" width={40} height={40} alt="lc" />
                        </div>
                        <h4>Active LCs</h4>
                        <p className={styles.amount}>{stats?.summary?.[0]?.activeLCs ? stats?.summary?.[0]?.activeLCs : '0'}
                            {/* <span className={styles.positive}>+5%</span> */}
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className={styles.main}>
                    <div className={styles.chartCard}>
                        <div className={styles.chart_header}>
                            <Image src="/file-chart-line.svg" width={24} height={24} alt="" />
                            <h1>Annual Transaction Overview</h1>
                        </div>
                        <ResponsiveContainer width="100%" height="95%">
                            <BarChart data={annualData}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="funded" stackId="a" fill="#000" />
                                <Bar dataKey="completed" stackId="a" fill="#ccc" />
                                <Bar dataKey="refunded" stackId="a" fill="#eee" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className={styles.chartCard}>
                        <div className={styles.chart_header}>
                            <Image src="/file-chart-line.svg" width={24} height={24} alt="" />
                            <h1>Monthly LC Activities</h1>
                        </div>
                        <ResponsiveContainer width="100%" height="95%">
                            <LineChart data={monthlyActivities}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="active" stroke="#000" dot={false} />
                                <Line type="monotone" dataKey="completed" stroke="#8884d8" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;