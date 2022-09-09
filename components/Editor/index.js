import React, { useState, useRef, useCallback, memo } from 'react'
import ReactFlow, {
	ReactFlowProvider,
	Controls,
	Background,
	onNodeClick,
} from 'react-flow-renderer'
import store from '../../store/store.ts'
import create from 'zustand'

let id = 0
const getId = type => `${type}_${id++}`

const DnDFlow = () => {
	const useBoundStore = create(store)
	const {
		nodes,
		edges,
		nodeTypes,
		onNodesChange,
		onEdgesChange,
		onConnect,
		setNodes,
		onNodeClick,
		onPaneClick
	} = useBoundStore()
	const reactFlowWrapper = useRef(null)
	const [reactFlowInstance, setReactFlowInstance] = useState(null)

	const onDragOver = useCallback(event => {
		event.preventDefault()
		event.dataTransfer.dropEffect = 'move'
	}, [])

	const onDrop = useCallback(
		event => {
			event.preventDefault()

			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
			const type = event.dataTransfer.getData('application/reactflow')
			const model = event.dataTransfer.getData('application/reactflow/model')
			const data = event.dataTransfer.getData('application/reactflow/data')
			if (typeof type === 'undefined' || !type) {
				return
			}
			console.log(reactFlowInstance.toObject())
			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			})
			const newNode = {
				id: getId(type),
				type,
				model,
				position,
				data: { label: `${type} node` },
			}

			setNodes(newNode)
		},
		[reactFlowInstance, setNodes]
	)

	return (
		<div className='dndflow'>
			<ReactFlowProvider>
				<div className='reactflow-wrapper' ref={reactFlowWrapper}>
					<ReactFlow

						nodeTypes={nodeTypes}
						nodes={nodes}
						edges={edges}
						deleteKeyCode={['Backspace', 'Delete']}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnect={onConnect}
						onInit={setReactFlowInstance}
						onDrop={onDrop}
						onDragOver={onDragOver}
						onNodeClick = {onNodeClick}
						onPaneClick = {onPaneClick}
						fitView>
						<Controls />
						<Background
							style={{
								backgroundColor: '#1a192b',
							}}
						/>
					</ReactFlow>
				</div>
			</ReactFlowProvider>
		</div>
	)
}

export default memo(DnDFlow)
