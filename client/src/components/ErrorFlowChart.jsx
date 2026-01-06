import { useEffect, useRef } from 'react';

const ErrorFlowChart = ({ analysis }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!analysis || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set up styles
    const nodeWidth = 200;
    const nodeHeight = 80;
    const nodeSpacing = 120;
    const startY = 50;
    const centerX = width / 2;

    // Colors
    const errorColor = '#ff1744';
    const processColor = '#00ff41';
    const greenColor = '#00ff41';
    const fixColor = '#ff4569';
    const bgColor = '#000000';
    const textColor = '#ffffff';
    const lineColor = '#dc143c';

    // Draw nodes
    const nodes = [
      { x: centerX, y: startY, text: 'ERROR OCCURRED', color: errorColor, type: 'error' },
      { x: centerX, y: startY + nodeSpacing, text: 'ROOT CAUSE', color: greenColor, type: 'process' },
      { x: centerX - nodeWidth - 50, y: startY + nodeSpacing * 2, text: 'POSSIBLE CAUSES', color: greenColor, type: 'causes' },
      { x: centerX + nodeWidth + 50, y: startY + nodeSpacing * 2, text: 'FIX APPLIED', color: fixColor, type: 'fix' },
      { x: centerX, y: startY + nodeSpacing * 3, text: 'RESOLVED', color: greenColor, type: 'success' },
    ];

    // Draw connections
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    // Error to Root Cause
    ctx.beginPath();
    ctx.moveTo(nodes[0].x, nodes[0].y + nodeHeight / 2);
    ctx.lineTo(nodes[1].x, nodes[1].y - nodeHeight / 2);
    ctx.stroke();

    // Root Cause to Possible Causes
    ctx.beginPath();
    ctx.moveTo(nodes[1].x - nodeWidth / 2, nodes[1].y + nodeHeight / 2);
    ctx.lineTo(nodes[2].x, nodes[2].y - nodeHeight / 2);
    ctx.stroke();

    // Root Cause to Fix Applied
    ctx.beginPath();
    ctx.moveTo(nodes[1].x + nodeWidth / 2, nodes[1].y + nodeHeight / 2);
    ctx.lineTo(nodes[3].x, nodes[3].y - nodeHeight / 2);
    ctx.stroke();

    // Possible Causes to Resolved
    ctx.beginPath();
    ctx.moveTo(nodes[2].x, nodes[2].y + nodeHeight / 2);
    ctx.lineTo(nodes[4].x - nodeWidth / 2, nodes[4].y - nodeHeight / 2);
    ctx.stroke();

    // Fix Applied to Resolved
    ctx.beginPath();
    ctx.moveTo(nodes[3].x, nodes[3].y + nodeHeight / 2);
    ctx.lineTo(nodes[4].x + nodeWidth / 2, nodes[4].y - nodeHeight / 2);
    ctx.stroke();

    ctx.setLineDash([]);

    // Draw nodes
    nodes.forEach((node, index) => {
      // Draw node background
      ctx.fillStyle = bgColor;
      ctx.fillRect(node.x - nodeWidth / 2, node.y - nodeHeight / 2, nodeWidth, nodeHeight);

      // Draw node border
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 3;
      ctx.strokeRect(node.x - nodeWidth / 2, node.y - nodeHeight / 2, nodeWidth, nodeHeight);

      // Draw glow effect
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 15;
      ctx.strokeRect(node.x - nodeWidth / 2, node.y - nodeHeight / 2, nodeWidth, nodeHeight);
      ctx.shadowBlur = 0;

      // Draw text
      ctx.fillStyle = textColor;
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.text, node.x, node.y);
    });

    // Draw possible causes as smaller nodes
    if (analysis.possible_causes && analysis.possible_causes.length > 0) {
      const causesX = nodes[2].x;
      const causesY = nodes[2].y + nodeHeight / 2 + 30;
      const causeNodeWidth = 150;
      const causeNodeHeight = 50;
      const causeSpacing = 60;

      analysis.possible_causes.forEach((cause, idx) => {
        const causeY = causesY + idx * causeSpacing;
        
        // Connection from Possible Causes node
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(causesX, nodes[2].y + nodeHeight / 2);
        ctx.lineTo(causesX, causeY - causeNodeHeight / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw cause node
        ctx.fillStyle = bgColor;
        ctx.fillRect(causesX - causeNodeWidth / 2, causeY - causeNodeHeight / 2, causeNodeWidth, causeNodeHeight);
        
        ctx.strokeStyle = greenColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(causesX - causeNodeWidth / 2, causeY - causeNodeHeight / 2, causeNodeWidth, causeNodeHeight);

        // Draw probability
        ctx.fillStyle = textColor;
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${cause.probability}%`, causesX, causeY - 8);
        
        ctx.font = '10px monospace';
        const maxWidth = causeNodeWidth - 10;
        const causeText = cause.cause.length > 30 ? cause.cause.substring(0, 27) + '...' : cause.cause;
        ctx.fillText(causeText, causesX, causeY + 8);
      });
    }

  }, [analysis]);

  return (
    <div className="bg-cyber-black rounded-xl p-6 border border-cyber-red/40 overflow-auto">
      <h3 className="text-xl font-bold text-white mb-4 font-mono flex items-center">
        <span className="text-cyber-red mr-2">[</span>
        ERROR_FLOW_DIAGRAM
        <span className="text-cyber-red ml-2">]</span>
      </h3>
      <div className="flex justify-center overflow-x-auto">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border border-cyber-red/40 rounded-lg bg-cyber-black shadow-lg"
        />
      </div>
      <div className="mt-4 text-sm text-gray-400 font-mono space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 border-2 border-cyber-red bg-cyber-black"></div>
          <span>Error Occurrence</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 border-2 border-cyber-green bg-cyber-black"></div>
          <span>Analysis Process</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 border-2 border-cyber-red-light bg-cyber-black"></div>
          <span>Fix Applied</span>
        </div>
      </div>
    </div>
  );
};

export default ErrorFlowChart;

