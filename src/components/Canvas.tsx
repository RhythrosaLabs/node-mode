import React, { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Node } from './node/Node';
import { NodeSearch } from './NodeSearch';
import { NodeConfig } from './node/NodeConfig';
import { useNodeStore } from '../store/nodeStore';
import { Connection, NodeData } from '../types/node';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { Grid } from './canvas/Grid';
import { ConnectionLine } from './canvas/ConnectionLine';
import { toast } from 'sonner';

export const Canvas: React.FC = () => {
  const { nodes, connections, addConnection, updateNodePosition, undo, redo, selectedNodeId, selectNode, deleteNode } = useNodeStore();
  const selectedNode = nodes.find(n => n.id === selectedNodeId) ?? null;
  const [activeConnection, setActiveConnection] = useState<Partial<Connection> | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useKeyboardShortcuts({
    onUndo: () => {
      undo();
      toast.info('Undo');
    },
    onRedo: () => {
      redo();
      toast.info('Redo');
    },
    onDelete: () => {
      if (selectedNodeId) {
        deleteNode(selectedNodeId);
      }
    },
  });

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, delta } = event;
    const nodeId = active.id as string;
    const node = nodes.find((n) => n.id === nodeId);
    
    if (node) {
      updateNodePosition(nodeId, {
        x: node.position.x + delta.x,
        y: node.position.y + delta.y,
      });
    }
  }, [nodes, updateNodePosition]);

  const handleConnect = useCallback((nodeId: string, portId: string, isInput: boolean) => {
    if (!activeConnection) {
      setActiveConnection({
        id: Math.random().toString(),
        sourceNodeId: isInput ? '' : nodeId,
        sourcePortId: isInput ? '' : portId,
        targetNodeId: isInput ? nodeId : '',
        targetPortId: isInput ? portId : ''
      });
      toast.info('Click a target input port to complete the connection');
    } else {
      if (isInput && activeConnection.sourceNodeId) {
        try {
          addConnection({
            id: activeConnection.id!,
            sourceNodeId: activeConnection.sourceNodeId,
            sourcePortId: activeConnection.sourcePortId!,
            targetNodeId: nodeId,
            targetPortId: portId
          });
          toast.success('Connection created');
        } catch (error) {
          toast.error('Invalid connection');
        }
      }
      setActiveConnection(null);
    }
  }, [activeConnection, addConnection]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale((s) => Math.min(Math.max(0.1, s * delta), 2));
    } else {
      setOffset((o) => ({
        x: o.x - e.deltaX,
        y: o.y - e.deltaY,
      }));
    }
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectNode(null);
      if (activeConnection) {
        setActiveConnection(null);
        toast.info('Connection cancelled');
      }
    }
  }, [selectNode, activeConnection]);

  return (
    <div 
      className="w-full h-[calc(100vh-3rem)] bg-gray-50 dark:bg-gray-800 relative overflow-hidden"
      onWheel={handleWheel}
      onClick={handleCanvasClick}
    >
      <NodeSearch />
      
      <div className="absolute right-4 top-4 w-72 z-10">
        {selectedNode && <NodeConfig node={selectedNode} />}
      </div>

      {activeConnection && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-full shadow-lg">
          Click a target input port — Esc or click canvas to cancel
        </div>
      )}

      <DndContext
        sensors={sensors}
        modifiers={[restrictToWindowEdges]}
        onDragEnd={handleDragEnd}
      >
        <div 
          className="absolute inset-0 transition-transform"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: '0 0',
          }}
        >
          <Grid />
          
          <svg className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
            {connections.map((conn) => {
              const sourceNode = nodes.find((n) => n.id === conn.sourceNodeId);
              const targetNode = nodes.find((n) => n.id === conn.targetNodeId);
              
              if (!sourceNode || !targetNode) return null;
              
              return (
                <ConnectionLine
                  key={conn.id}
                  connection={conn}
                  sourceNode={sourceNode}
                  targetNode={targetNode}
                />
              );
            })}
          </svg>
          
          {nodes.map((node) => (
            <Node
              key={node.id}
              node={node}
              onConnect={handleConnect}
              onSelect={() => selectNode(node.id)}
              isSelected={selectedNodeId === node.id}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
};
