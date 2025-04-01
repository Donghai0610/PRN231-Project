/**
 * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
 * https://ckeditor.com/ckeditor-5/builder/?redirect=portal#installation/NoNgNARATAdAzPCkAsAOEB2DAGAnHZZEVOVKVZAVmo1UuSksyh2zl2QEYRkkIA3AJZJsYYJzASpkyQF1IAIxABDAKaVVyiLKA===
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';

import '../../../CSS/EditorComponent.css';

const LICENSE_KEY =
	'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NzI0MDk1OTksImp0aSI6IjIzYWEzOTk3LWE0MDktNGU4MC1iZjY4LTg0YjA4Nzg4YjU4YyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiXSwiZmVhdHVyZXMiOlsiRFJVUCJdLCJ2YyI6IjhkOGY5ZWYwIn0.1EiMr_VBqBgUJXP3hT-Bn25N7DIooztIrnTEODPA_sJsaVOAcJyYIiPJ-gXOu9slW_g4-3QUnJuPuLS4eENtyg';

/**
 * USE THIS INTEGRATION METHOD ONLY FOR DEVELOPMENT PURPOSES.
 *
 * This sample is configured to use OpenAI API for handling AI Assistant queries.
 * See: https://ckeditor.com/docs/ckeditor5/latest/features/ai-assistant/ai-assistant-integration.html
 * for a full integration and customization guide.
 */
const AI_API_KEY = 'AIzaSyC11EjCxTVy5bYGi8xspcIN5sKUIQn5KkI';

const CLOUD_SERVICES_TOKEN_URL =
	'https://z7z84bz822nt.cke-cs.com/token/dev/3bd5a8bcdd0c28369302d6dbe4bb6609994e15f90c188d6eb0e88431b4a5?limit=10';

export default function EditorComponent({ content, setContent }) {
	const editorContainerRef = useRef(null);
	const editorRef = useRef(null);
	const editorWordCountRef = useRef(null);
	const editorInstanceRef = useRef(null);
	const [isLayoutReady, setIsLayoutReady] = useState(false);
	const cloud = useCKEditorCloud({ version: '44.3.0', premium: true, translations: ['vi'], ckbox: { version: '2.6.1' } });
	
	// Track if content was loaded into editor
	const [contentLoaded, setContentLoaded] = useState(false);

	useEffect(() => {
		setIsLayoutReady(true);

		return () => setIsLayoutReady(false);
	}, []);

	// Effect to update editor content when content prop changes
	useEffect(() => {
		if (editorInstanceRef.current && content && !contentLoaded) {
			editorInstanceRef.current.setData(content);
			setContentLoaded(true);
		}
	}, [content, editorInstanceRef.current, contentLoaded]);

	const { ClassicEditor, editorConfig } = useMemo(() => {
		if (cloud.status !== 'success' || !isLayoutReady) {
			return {};
		}

		const {
			ClassicEditor,
			Autoformat,
			AutoImage,
			Autosave,
			BlockQuote,
			Bold,
			CloudServices,
			Essentials,
			Heading,
			Image,
			ImageBlock,
			ImageCaption,
			ImageStyle,
			ImageToolbar,
			ImageUpload,
			Indent,
			Italic,
			Link,
			List,
			MediaEmbed,
			Paragraph,
			PasteFromOffice,
			Table,
			TableToolbar,
			TextTransformation,
			Underline,
			WordCount
		} = cloud.CKEditor;

		return {
			ClassicEditor,
			editorConfig: {
				toolbar: {
					items: [
						'heading', '|',
						'bold', 'italic', 'underline', '|',
						'link', 'insertImage', 'mediaEmbed', '|',
						'bulletedList', 'numberedList', '|',
						'outdent', 'indent', '|',
						'blockQuote', 'insertTable', '|',
						'undo', 'redo'
					],
					shouldNotGroupWhenFull: true
				},
				plugins: [
					Autoformat, AutoImage, Autosave, BlockQuote, Bold, CloudServices, Essentials, 
					Heading, Image, ImageBlock, ImageCaption, ImageStyle, ImageToolbar, ImageUpload,
					Indent, Italic, Link, List, MediaEmbed, Paragraph, PasteFromOffice,
					Table, TableToolbar, TextTransformation, Underline, WordCount
				],
				cloudServices: {
					tokenUrl: CLOUD_SERVICES_TOKEN_URL
				},
				image: {
					toolbar: [
						'imageStyle:inline',
						'imageStyle:block',
						'imageStyle:side',
						'|',
						'toggleImageCaption',
						'imageTextAlternative'
					]
				},
				table: {
					contentToolbar: [
						'tableColumn',
						'tableRow',
						'mergeTableCells'
					]
				},
				initialData: content || '', // Set initial data from props
				language: 'vi',
				licenseKey: LICENSE_KEY,
				placeholder: 'Nhập nội dung bài viết vào đây...',
			}
		};
	}, [cloud, isLayoutReady, content]);

	return (
		<div className="main-container">
			<div className="editor-wrapper">
				<label className="editor-label">Nội dung</label>
				<div
					className="editor-container editor-container_classic-editor"
					ref={editorContainerRef}
				>
					<div className="editor-container__editor">
						<div ref={editorRef}>
							{ClassicEditor && editorConfig && (
								<CKEditor
									onReady={editor => {
										editorInstanceRef.current = editor;
										const wordCount = editor.plugins.get('WordCount');
										if (wordCount && editorWordCountRef.current) {
											editorWordCountRef.current.appendChild(wordCount.wordCountContainer);
										}
										
										// Set initial content if available
										if (content && !contentLoaded) {
											editor.setData(content);
											setContentLoaded(true);
										}
									}}
									onChange={(event, editor) => {
										const data = editor.getData();
										setContent(data);
									}}
									editor={ClassicEditor}
									config={editorConfig}
								/>
							)}
						</div>
					</div>
					<div className="editor-word-count" ref={editorWordCountRef}></div>
				</div>
			</div>
		</div>
	);
}

/**
 * This function exists to remind you to update the config needed for premium features.
 * The function can be safely removed. Make sure to also remove call to this function when doing so.
 */
function configUpdateAlert(config) {
	if (configUpdateAlert.configUpdateAlertShown) {
		return;
	}

	const valuesToUpdate = [];
	configUpdateAlert.configUpdateAlertShown = true;

	if (!config.licenseKey) {
		valuesToUpdate.push('LICENSE_KEY');
	}

	if (valuesToUpdate.length) {
		window.alert(
			[
				'Please update the following values in your editor config',
				'to receive full access to Premium Features:',
				'',
				...valuesToUpdate.map(value => ` - ${value}`)
			].join('\n')
		);
	}
}