export function StatsCard({ label, value, icon }) {
    return (
        <div className="glass-card rounded-xl p-6 hover-lift">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground mb-1">
                        {label}
                    </p>
                    <p className="text-2xl font-bold text-accent">{value}</p>
                </div>
                <div className="text-3xl opacity-60">{icon}</div>
            </div>
        </div>
    );
}
