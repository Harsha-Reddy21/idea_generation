import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/TextEditor.css';

const TextEditor = ({ content, onChange }) => {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['link'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'indent',
        'link'
    ];

    return (
        <div className="text-editor-container">
            {content === '' ? (
                <div className="editor-placeholder">
                    <div className="placeholder-content">
                        <svg className="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3>Your document will appear here</h3>
                        <p>Start chatting with the AI assistant to draft your proposal</p>
                    </div>
                </div>
            ) : null}
            <ReactQuill
                theme="snow"
                value={content}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder="Your AI-generated document will appear here..."
            />
        </div>
    );
};

export default TextEditor;
