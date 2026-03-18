import React from 'react';

export default function KSRTCNextBusApp() {
    const routeData = {
        "nilambur-to-kozhikode": {
            id: "nilambur-to-kozhikode",
            from: "Nilambur",
            to: "Kozhikode",
            standNote: "Unofficial sample timings based on the uploaded poster. Verify before travel.",
            times: [
                "05:15", "05:50", "06:10", "06:35", "07:00", "08:40",
                "11:10", "12:15", "13:10", "14:00", "14:30", "16:05"
            ]
        },
        "kozhikode-to-nilambur": {
            id: "kozhikode-to-nilambur",
            from: "Kozhikode",
            to: "Nilambur",
            standNote: "From Kozhikode (Palayam Stand). Unofficial sample timings based on the uploaded poster.",
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
    const upcomingBuses = route.times.filter((time) => toMinutes(time) >= currentMinutes);

    const minutesAway = (time) => {
        const diff = toMinutes(time) - currentMinutes;
        if (diff <= 0) return "Now";
        if (diff < 60) return `${diff} min`;
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        return mins ? `${hours}h ${mins}m` : `${hours}h`;
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="rounded-3xl bg-white shadow-sm border p-6 md:p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">KSRTC Timing Finder</p>
                            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mt-2">Find the next bus fast</h1>
                            <p className="text-slate-600 mt-3 max-w-2xl">
                                A simple community-made timing viewer for Kerala KSRTC routes. Start with one route, then expand route by route.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                            Current time: <span className="font-semibold">{now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-[320px_1fr]">
                    <div className="rounded-3xl bg-white shadow-sm border p-4">
                        <p className="text-sm font-medium text-slate-500 mb-3">Choose a route</p>
                        <div className="space-y-3">
                            {Object.values(routeData).map((item) => {
                                const active = item.id === selectedRouteId;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setSelectedRouteId(item.id)}
                                        className={`w-full text-left rounded-2xl border p-4 transition ${active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                                    >
                                        <div className="text-base font-semibold">{item.from} → {item.to}</div>
                                        <div className={`text-sm mt-1 ${active ? 'text-slate-300' : 'text-slate-500'}`}>{item.standNote}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl bg-white shadow-sm border p-6">
                            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Selected route</p>
                            <h2 className="text-2xl md:text-3xl font-semibold mt-2">{route.from} → {route.to}</h2>
                            <p className="text-slate-600 mt-2">{route.standNote}</p>

                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl bg-slate-900 text-white p-5">
                                    <p className="text-sm text-slate-300">Next bus</p>
                                    {nextBus ? (
                                        <>
                                            <div className="text-4xl font-semibold mt-2">{formatTime(nextBus)}</div>
                                            <div className="text-slate-300 mt-2">Leaves in {minutesAway(nextBus)}</div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-3xl font-semibold mt-2">No more buses today</div>
                                            <div className="text-slate-300 mt-2">Check tomorrow or verify with depot</div>
                                        </>
                                    )}
                                </div>

                                <div className="rounded-2xl bg-slate-100 p-5">
                                    <p className="text-sm text-slate-500">Quick facts</p>
                                    <div className="mt-3 space-y-2 text-sm text-slate-700">
                                        <div>Total listed services: <span className="font-semibold">{route.times.length}</span></div>
                                        <div>First bus: <span className="font-semibold">{formatTime(route.times[0])}</span></div>
                                        <div>Last bus: <span className="font-semibold">{formatTime(route.times[route.times.length - 1])}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white shadow-sm border p-6">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Today's timings</p>
                                    <h3 className="text-xl font-semibold mt-2">All buses on this route</h3>
                                </div>
                                <div className="text-sm text-slate-500">Tap a route on the left to switch direction</div>
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {route.times.map((time) => {
                                    const isPast = toMinutes(time) < currentMinutes;
                                    const isNext = time === nextBus;
                                    return (
                                        <div
                                            key={time}
                                            className={`rounded-2xl border p-4 ${isNext ? 'border-slate-900 bg-slate-900 text-white' : isPast ? 'border-slate-200 bg-slate-100 text-slate-400' : 'border-slate-200 bg-white text-slate-900'}`}
                                        >
                                            <div className="text-lg font-semibold">{formatTime(time)}</div>
                                            <div className={`text-sm mt-1 ${isNext ? 'text-slate-300' : isPast ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {isNext ? `Next • ${minutesAway(time)}` : isPast ? 'Departed' : `In ${minutesAway(time)}`}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                            This is the right MVP: one route, clear next-bus logic, simple manual data. After this, the next step is moving timings into a JSON file or Google Sheet so non-designers can update it without touching code.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
