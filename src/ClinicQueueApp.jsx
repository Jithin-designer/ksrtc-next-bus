import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const toSafeNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

const calculateQueue = ({ currentToken, yourToken, avgMinutes, bufferMinutes }) => {
    const safeCurrent = toSafeNumber(currentToken);
    const safeYour = toSafeNumber(yourToken);
    const safeAvg = toSafeNumber(avgMinutes);
    const safeBuffer = toSafeNumber(bufferMinutes);

    const tokenDifference = safeYour - safeCurrent;
    const peopleAhead = Math.max(tokenDifference, 0);
    const waitMinutes = peopleAhead * safeAvg + safeBuffer;
    const hasInvalidOrder = safeYour < safeCurrent;

    return {
        safeCurrent,
        safeYour,
        safeAvg,
        safeBuffer,
        tokenDifference,
        peopleAhead,
        waitMinutes,
        hasInvalidOrder,
    };
};

const formatWait = (mins) => {
    if (mins <= 0) return 'You may be next.';

    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;

    if (hours === 0) return `About ${minutes} min`;
    if (minutes === 0) return `About ${hours} hr`;
    return `About ${hours} hr ${minutes} min`;
};

const getStatusMessage = ({ safeCurrent, safeYour, peopleAhead }) => {
    if (safeYour < safeCurrent) {
        return 'Your token looks smaller than the current token. Check the numbers.';
    }
    if (safeYour === safeCurrent) {
        return 'You should be getting called now.';
    }
    if (peopleAhead <= 2) {
        return 'You are close. Stay nearby.';
    }
    if (peopleAhead <= 5) {
        return 'Not too far. Keep an eye on the queue.';
    }
    return 'You still have some wait time.';
};

export default function ClinicQueueApp() {
    const [currentToken, setCurrentToken] = React.useState(18);
    const [yourToken, setYourToken] = React.useState(27);
    const [avgMinutes, setAvgMinutes] = React.useState(7);
    const [bufferMinutes, setBufferMinutes] = React.useState(10);

    const {
        safeCurrent,
        safeYour,
        safeAvg,
        safeBuffer,
        peopleAhead,
        waitMinutes,
    } = calculateQueue({
        currentToken,
        yourToken,
        avgMinutes,
        bufferMinutes,
    });

    const statusMessage = getStatusMessage({
        safeCurrent,
        safeYour,
        peopleAhead,
    });

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-slate-50">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Section */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-teal-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Healthcare</span>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Queue Estimator</p>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
                            Wait time <span className="text-teal-500">simplified.</span>
                        </h1>
                    </div>
                    <div className="glass-card-dark rounded-3xl px-6 py-4 flex items-center gap-4 bg-slate-900/90">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Live Status</p>
                            <p className="text-2xl font-mono font-bold text-white uppercase">Active</p>
                        </div>
                    </div>
                </motion.header>

                <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
                    {/* Main Content - Inputs */}
                    <motion.main
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                        <section className="glass-card rounded-[3rem] p-8 md:p-12 space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Queue Details</h2>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Update values below</span>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Current Token</label>
                                    <input
                                        type="number"
                                        value={currentToken}
                                        onChange={(e) => setCurrentToken(e.target.value)}
                                        className="w-full glass-card rounded-2xl px-6 py-4 text-xl font-bold text-slate-900 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Your Token</label>
                                    <input
                                        type="number"
                                        value={yourToken}
                                        onChange={(e) => setYourToken(e.target.value)}
                                        className="w-full glass-card rounded-2xl px-6 py-4 text-xl font-bold text-slate-900 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Avg. Mins / Patient</label>
                                    <input
                                        type="number"
                                        value={avgMinutes}
                                        onChange={(e) => setAvgMinutes(e.target.value)}
                                        className="w-full glass-card rounded-2xl px-6 py-4 text-xl font-bold text-slate-900 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Buffer Minutes</label>
                                    <input
                                        type="number"
                                        value={bufferMinutes}
                                        onChange={(e) => setBufferMinutes(e.target.value)}
                                        className="w-full glass-card rounded-2xl px-6 py-4 text-xl font-bold text-slate-900 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Visual Queue Line */}
                            <div className="space-y-4 pt-4">
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Queue Visualization</p>
                                <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((safeCurrent / safeYour) * 100, 100)}%` }}
                                        className="absolute top-0 left-0 h-full bg-teal-500 rounded-full"
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
                                    <span>Token {safeCurrent}</span>
                                    <span>Token {safeYour}</span>
                                </div>
                            </div>
                        </section>

                        {/* Footer Note */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="glass-card rounded-3xl p-6 text-center"
                        >
                            <p className="text-sm text-slate-500 font-medium">
                                Estimates are based on average consultation times.
                                <br className="hidden md:block" />
                                Actual wait times may vary based on case complexity.
                            </p>
                        </motion.div>
                    </motion.main>

                    {/* Sidebar - Results */}
                    <motion.aside
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                    >
                        <div className="glass-card-dark rounded-[3rem] p-8 md:p-10 space-y-8 bg-slate-900 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />

                            <div className="relative z-10 space-y-6">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-2">Estimated Wait</p>
                                    <AnimatePresence mode="wait">
                                        <motion.h2
                                            key={waitMinutes}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="text-4xl md:text-5xl font-black leading-tight"
                                        >
                                            {formatWait(waitMinutes)}
                                        </motion.h2>
                                    </AnimatePresence>
                                </div>

                                <div className="inline-flex items-center gap-3 px-6 py-3 bg-teal-500/10 text-teal-400 rounded-full font-bold text-sm">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                                    </span>
                                    {statusMessage}
                                </div>

                                <div className="pt-8 space-y-6 border-t border-white/10">
                                    <div className="flex justify-between items-center">
                                        <p className="text-slate-400 text-[10px] uppercase font-bold">People Ahead</p>
                                        <p className="text-2xl font-black text-white">{peopleAhead}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-slate-400 text-[10px] uppercase font-bold">Avg. Consultation</p>
                                        <p className="text-xl font-bold text-white">{safeAvg} min</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-slate-400 text-[10px] uppercase font-bold">Delay Buffer</p>
                                        <p className="text-xl font-bold text-white">{safeBuffer} min</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card rounded-[2.5rem] p-8 space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Quick Tip</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                If you're more than 5 tokens away, you might have time for a quick coffee. Stay within 10 minutes of the clinic.
                            </p>
                        </div>
                    </motion.aside>
                </div>
            </div>
        </div>
    );
}
