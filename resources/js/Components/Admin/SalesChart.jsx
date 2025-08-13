export function SalesChart() { return (
<div
    className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
>
    <h3 className="font-heading font-semibold text-xl mb-6 text-white">
        Sales Overview
    </h3>
    <div className="h-64 flex items-center justify-center text-slate-400">
        <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <p>Sales chart would be rendered here</p>
            <p className="text-sm">Integration with charting library needed</p>
        </div>
    </div>
</div>
) }
