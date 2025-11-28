export default function ArogyaAgentLogo({ size = 'default', showText = true }) {
    const sizes = {
        small: 'w-8 h-8',
        default: 'w-10 h-10',
        large: 'w-16 h-16'
    };

    const textSizes = {
        small: 'text-lg',
        default: 'text-2xl',
        large: 'text-4xl'
    };

    return (
        <div className="flex items-center gap-3">
            <div className="relative">
                <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 flex items-center justify-center shadow-lg`}>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1.5 h-6 bg-white rounded-full"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-1.5 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className={`absolute inset-0 ${sizes[size]} rounded-full border-2 border-teal-400 animate-ping opacity-20`}></div>
            </div>

            {showText && (
                <div className="flex flex-col">
                    <span className={`${textSizes[size]} font-bold bg-gradient-to-r from-teal-700 via-cyan-700 to-blue-700 bg-clip-text text-transparent`}>
                        ArogyaAgent
                    </span>
                    <span className="text-xs text-slate-600 font-medium tracking-wide">
                        Healthcare Intelligence
                    </span>
                </div>
            )}
        </div>
    );
}

export function ArogyaAgentIcon({ size = 'default' }) {
    return <ArogyaAgentLogo size={size} showText={false} />;
}

export function ArogyaAgentFavicon() {
    return (
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-600 to-blue-600 flex items-center justify-center">
            <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-8 bg-white rounded-full"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-2 bg-white rounded-full"></div>
                </div>
            </div>
        </div>
    );
}
