/* eslint-disable react/prop-types */
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function GeneratedContent({ markedDownText }) {
    return (
        <div className="flex flex-col justify-between h-full w-full p-4 bg-base-200 rounded-lg shadow-lg">
            <h6 className="text-md text-center mb-4">Generated Content</h6>   
            <div className="prose max-w-full p-4 overflow-auto rounded-lg">
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ ...props }) => <h1 className="text-2xl font-bold text-white" {...props} />,
                        p: ({ ...props }) => <p className="text-white leading-relaxed" {...props} />,
                        code: ({ ...props }) => (
                            <code className="text-white px-1 py-0.5 rounded bg-gray-800" {...props} />
                        ),
                    }}
                >
                    {markedDownText}
                </Markdown>
            </div>
        </div>
    );
}
