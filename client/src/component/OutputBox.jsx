 /* eslint-disable react/prop-types */
export default function OutputBox({output , isRunning , isError}){
    const val = "//click the run button to see output";
    return(
        <>
        <div className="w-1/2 h-95vh px-4 py-2 flex bg-base-200 shadow-2xl mt-6 overflow-x-auto">
            {
                isRunning ? (
                <div className="flex items-center justify-center mx-auto">
                <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : output ? (<pre className="whitespace-pre-wrap text-xl">{output}</pre>) : (
                    <div className="text-center">
                        <p className="px-2 py-1 text-md text-md">{val}</p>
                    </div>
                )
            }
            {
                isError && (<div className="text-red-500 mt-4">Unable to run code. Please try again.</div>)
            }
            
        </div>
        </>
    )
}