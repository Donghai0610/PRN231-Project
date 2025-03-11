/**
 * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
 * https://ckeditor.com/ckeditor-5/builder/?redirect=portal#installation/NoNgNARATAdAzPCkAsAOEB2DAGAnHZZEVOVKVZAVmo1UuSksyh2zl2QEYRkkIA3AJZJsYYJzASpkyQF1IAIxABDAKaVVyiLKA===
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';

import '../../../CSS/EditorComponent.css';

const LICENSE_KEY =
	'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDI5NDcxOTksImp0aSI6ImJiZDI1MWUwLTNiZmMtNDRmNy1hNDUyLWNjMTg2YWFhMmNhNSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjQyZTRjZjEyIn0.mOinvJt7xBvVHEWviUG0yDlrfDkGycQ95UNpIphSa3O8yjWLPkwlSHEUa__4wZTHv4nKu92K2veSv0np0Jt5Cw';

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
		const [isLayoutReady, setIsLayoutReady] = useState(false);
		const cloud = useCKEditorCloud({ version: '44.3.0', premium: true, translations: ['vi'], ckbox: { version: '2.6.1' } });
	
		useEffect(() => {
			setIsLayoutReady(true);
	
			return () => setIsLayoutReady(false);
		}, []);
	
		const { ClassicEditor, editorConfig } = useMemo(() => {
			if (cloud.status !== 'success' || !isLayoutReady) {
				return {};
			}
	
			const {
				ClassicEditor,
				Autoformat,
				AutoImage,
				Autosave,
				BalloonToolbar,
				BlockQuote,
				BlockToolbar,
				Bold,
				CKBox,
				CKBoxImageEdit,
				CloudServices,
				Emoji,
				Essentials,
				Heading,
				ImageBlock,
				ImageCaption,
				ImageInline,
				ImageInsert,
				ImageInsertViaUrl,
				ImageResize,
				ImageStyle,
				ImageTextAlternative,
				ImageToolbar,
				ImageUpload,
				Indent,
				IndentBlock,
				Italic,
				Link,
				LinkImage,
				List,
				ListProperties,
				MediaEmbed,
				Mention,
				Paragraph,
				PasteFromOffice,
				PictureEditing,
				Table,
				TableCaption,
				TableCellProperties,
				TableColumnResize,
				TableProperties,
				TableToolbar,
				TextPartLanguage,
				TextTransformation,
				Title,
				TodoList,
				Underline,
				WordCount
			} = cloud.CKEditor;
	
			return {
				ClassicEditor,
				editorConfig: {
					toolbar: {
						items: [
							'bold', 'italic', 'underline', 'link', 'insertImage', 'mediaEmbed', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'undo', 'redo'
						],
						shouldNotGroupWhenFull: false
					},
					plugins: [
						Autoformat, AutoImage, Autosave, BlockQuote, Bold, CloudServices, Emoji, Essentials, Heading, ImageBlock, ImageCaption, 
						ImageInline, ImageInsert, ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative, ImageToolbar, ImageUpload, 
						Indent, IndentBlock, Italic, Link, LinkImage, List, ListProperties, MediaEmbed, Mention, Paragraph, PictureEditing, Table, 
						TableCaption, TableCellProperties, TableColumnResize, TableProperties, TableToolbar, TextPartLanguage, TextTransformation, 
						Title, TodoList, Underline, WordCount
					],
					cloudServices: {
						tokenUrl: CLOUD_SERVICES_TOKEN_URL
					},
					initialData: content,
					language: 'vi',
					licenseKey: LICENSE_KEY,
					placeholder: 'Type or paste your content here!',
				}
			};
		}, [cloud, isLayoutReady]);
	
		useEffect(() => {
			if (editorConfig) {
				configUpdateAlert(editorConfig);
			}
		}, [editorConfig]);
	
		return (
			<div className="main-container">
				<div
					className="editor-container editor-container_classic-editor editor-container_include-block-toolbar editor-container_include-word-count"
					ref={editorContainerRef}
				>
					<div className="editor-container__editor">
						<div ref={editorRef}>
							{ClassicEditor && editorConfig && (
								<CKEditor
									onReady={editor => {
										const wordCount = editor.plugins.get('WordCount');
										editorWordCountRef.current.appendChild(wordCount.wordCountContainer);
									}}
									onChange={(event, editor) => {
										const data = editor.getData(); // Get the HTML content from CKEditor
										setContent(data);  // Set content in the parent component (AddBlog)
									}}
									editor={ClassicEditor}
									config={editorConfig}
								/>
							)}
						</div>
					</div>
					<div className="editor_container__word-count" ref={editorWordCountRef}></div>
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