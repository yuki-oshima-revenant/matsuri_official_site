export const HomePage = () => {
    return (
        <div className="h-full">
            <div className="flex h-full justify-center pt-10">
                <div
                    className="font-serif font-bold text-6xl tracking-tighter"
                    style={{
                        writingMode: "vertical-rl",
                    }}
                >
                    <div className="px-2">
                        僕の
                        <span className="text-red-700 text-7xl py-2">最弱</span>
                        を以て、
                    </div>
                    <div className="px-2">
                        君の
                        <span className="text-red-700 text-7xl py-2">最強</span>
                        を打ち破る——。
                    </div>
                </div>
            </div>
        </div>
    );
};
