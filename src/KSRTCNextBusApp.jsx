import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KSRTCNextBusApp() {
    const routeData = {
        "nilambur-to-kozhikode": {
            id: "nilambur-to-kozhikode",
            from: "Nilambur",
            to: "Kozhikode",
            times: [
                "05:15", "05:50", "06:10", "06:35", "07:00", "08:40",
                "11:10", "12:15", "13:10", "14:00", "14:30", "16:05"
            ]
        },
        "kozhikode-to-nilambur": {
            id: "kozhikode-to-nilambur",
            from: "Kozhikode",
            to: "Nilambur",
            times: [
                "08:10", "08:30", "09:00", "10:10", "11:20", "14:40",
                "15:15", "15:40", "16:00", "16:40", "17:05", "18:45"
            ]
        }
    };

    const [selectedRouteId, setSelectedRouteId] = React.useState("nilambur-to-kozhikode");
    const [now, setNow] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

    const route = routeData[selectedRouteId];

    const toMinutes = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const formatTime = (time24) => {
        const [hourStr, minuteStr] = time24.split(":");
        let hour = Number(hourStr);
        const minute = minuteStr;
        const suffix = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${suffix}`;
    };

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const upcomingIndex = route.times.findIndex((time) => toMinutes(time) >= currentMinutes);
    const nextBus = upcomingIndex === -1 ? null : route.times[upcomingIndex];

    const minutesAway = (time) => {
        const diff = toMinutes(time) - currentMinutes;
        if (diff <= 0) return "Now";
        if (diff < 60) return `${diff} min`;
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        return mins ? `${hours}h ${mins}m` : `${hours}h`;
    };

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Section - Refined for First Fold */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left"
                >
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Live</span>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Next Departure</p>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-tight">
                            {nextBus ? (
                                <>
                                    {formatTime(nextBus).split(' ')[0]}
                                    <span className="text-amber-500 ml-2">{formatTime(nextBus).split(' ')[1]}</span>
                                </>
                            ) : (
                                <span className="text-slate-400 italic text-4xl">No more buses</span>
                            )}
                        </h1>
                        <p className="text-xl md:text-2xl font-bold text-slate-500">
                            {route.from} to {route.to}
                        </p>
                    </div>

                    {nextBus && (
                        <div className="glass-card-dark rounded-[2.5rem] p-8 md:p-10 flex flex-col items-center justify-center min-w-[240px]">
                            <div className="relative flex h-4 w-4 mb-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                            </div>
                            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">Leaves in</p>
                            <p className="text-4xl font-black text-white">{minutesAway(nextBus)}</p>
                        </div>
                    )}
                </motion.header>

                <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
                    {/* Sidebar - Route Selection */}
                    <motion.aside
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Select Route</p>
                        <div className="space-y-3">
                            {Object.values(routeData).map((item) => {
                                const active = item.id === selectedRouteId;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setSelectedRouteId(item.id)}
                                        className={`w-full text-left rounded-[2rem] p-6 transition-all duration-500 group relative overflow-hidden ${active
                                                ? 'transit-gradient text-white shadow-2xl scale-[1.02]'
                                                : 'glass-card hover:bg-white/90 text-slate-600'
                                            }`}
                                    >
                                        <div className="relative z-10">
                                            <div className="text-xl font-bold flex items-center gap-2">
                                                {item.from}
                                                <span className={`transition-transform duration-500 ${active ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>→</span>
                                                {item.to}
                                            </div>
                                        </div>
                                        {active && (
                                            <motion.div
                                                layoutId="active-pill"
                                                className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-50"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.aside>

                    {/* Main Content */}
                    <main className="space-y-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedRouteId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-8"
                            >
                                {/* Timings Grid */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between px-4">
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Today's Schedule</h3>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Total Services</p>
                                                <p className="text-sm font-black text-slate-900">{route.times.length}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {route.times.map((time, idx) => {
                                            const isPast = toMinutes(time) < currentMinutes;
                                            const isNext = time === nextBus;

                                            return (
                                                <motion.div
                                                    key={time}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className={`rounded-[2rem] p-6 transition-all duration-500 ${isNext
                                                            ? 'transit-gradient text-white shadow-2xl ring-4 ring-amber-500/20'
                                                            : isPast
                                                                ? 'bg-slate-200/50 text-slate-400 grayscale'
                                                                : 'glass-card hover:scale-[1.02] text-slate-900'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <span className="text-2xl font-black">{formatTime(time)}</span>
                                                        {isNext && (
                                                            <span className="px-3 py-1 bg-amber-500 text-white text-[8px] font-black uppercase rounded-full">Next</span>
                                                        )}
                                                    </div>
                                                    <p className={`text-xs font-bold uppercase tracking-widest ${isNext ? 'text-slate-400' : 'text-slate-400'}`}>
                                                        {isPast ? 'Departed' : isNext ? `In ${minutesAway(time)}` : `In ${minutesAway(time)}`}
                                                    </p>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Footer Note */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="glass-card rounded-3xl p-6 text-center"
                        >
                            <p className="text-sm text-slate-500 font-medium">
                                Built for the community. Timings are subject to change by KSRTC.
                                <br className="hidden md:block" />
                                Always verify with the local depot for critical travel.
                            </p>
                        </motion.div>
                    </main>
                </div>
            </div>
        </div>
    );
}
