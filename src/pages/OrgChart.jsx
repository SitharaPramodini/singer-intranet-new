import React, { useState, useEffect } from "react";
import { Search, Users } from 'lucide-react';
import { SlOrganization } from "react-icons/sl";

export default function OrgChart() {
    const [employees, setEmployees] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [positions, setPositions] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch top-level employees (no supervisor_HRIS)
    useEffect(() => {
        const fetchTopWithChildren = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/employees/orgchart/top");
                const topData = await res.json();

                // Fetch children for each top employee
                const withChildren = await Promise.all(
                    topData.map(async (emp) => {
                        const childRes = await fetch(`http://localhost:3000/api/employees/orgchart/${emp.HRIS}`);
                        const children = await childRes.json();
                        return { ...emp, children }; // attach children
                    })
                );

                setEmployees(withChildren);

                // Mark all top employees as expanded so their children are visible
                const expandedMap = {};
                withChildren.forEach(emp => {
                    if (emp.children && emp.children.length > 0) {
                        expandedMap[emp.HRIS] = true;
                    }
                });
                setExpanded(expandedMap);
            } catch (err) {
                console.error("Error fetching top employees with children:", err);
            }
        };

        fetchTopWithChildren();
    }, []);


    const expandToHRIS = async (targetHRIS) => {
        // BFS (or DFS) search through already loaded nodes
        const findAndExpand = async (nodes) => {
            for (const node of nodes) {
                if (node.HRIS === targetHRIS) {
                    return true; // Found it
                }
                if (node.children && node.children.length > 0) {
                    const foundInChild = await findAndExpand(node.children);
                    if (foundInChild) {
                        setExpanded(prev => ({ ...prev, [node.HRIS]: true }));
                        return true;
                    }
                } else {
                    // Fetch children if not already loaded
                    try {
                        const res = await fetch(`http://localhost:3000/api/employees/orgchart/${node.HRIS}`);
                        const children = await res.json();
                        if (children.length > 0) {
                            setEmployees(prev => updateTree(prev, node.HRIS, children));
                            setExpanded(prev => ({ ...prev, [node.HRIS]: true }));

                            // Recurse into children
                            const foundInChild = await findAndExpand(children);
                            if (foundInChild) return true;
                        }
                    } catch (err) {
                        console.error("Error fetching while searching:", err);
                    }
                }
            }
            return false;
        };

        await findAndExpand(employees);
    };


    // Recursive helper to update employees tree
    const updateTree = (nodes, hris, children) => {
        return nodes.map((node) => {
            if (node.HRIS === hris) {
                return { ...node, children };
            }
            if (node.children) {
                return { ...node, children: updateTree(node.children, hris, children) };
            }
            return node;
        });
    };

    // Toggle expand/collapse and fetch children if not loaded
    const handleExpand = async (hris) => {
        if (expanded[hris]) {
            setExpanded((prev) => ({ ...prev, [hris]: !prev[hris] }));
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/api/employees/orgchart/${hris}`);
            const children = await res.json();

            setEmployees((prev) => updateTree(prev, hris, children));
            setExpanded((prev) => ({ ...prev, [hris]: true }));
        } catch (err) {
            console.error("Error fetching children:", err);
        }
    };

    // Calculate positions for flowchart layout
    const calculatePositions = (nodes, startX = 400, startY = 50, level = 0) => {
        const nodeWidth = 200;
        const nodeHeight = 80;
        const levelHeight = 110; // Reduced from 150 to 110
        const positions = {};

        if (!nodes || nodes.length === 0) return positions;

        // Calculate total width needed for this level
        const totalWidth = nodes.length * nodeWidth + (nodes.length - 1) * 30; // Reduced spacing from 50 to 30
        let currentX = startX - totalWidth / 2;

        nodes.forEach((node, index) => {
            const x = currentX + index * (nodeWidth + 30); // Reduced spacing from 50 to 30
            const y = startY + level * levelHeight;

            positions[node.HRIS] = { x, y, width: nodeWidth, height: nodeHeight };

            // Calculate positions for children
            if (expanded[node.HRIS] && node.children && node.children.length > 0) {
                const childPositions = calculatePositions(
                    node.children,
                    x + nodeWidth / 2,
                    y + levelHeight,
                    level + 1
                );
                Object.assign(positions, childPositions);
            }
        });

        return positions;
    };

    // Generate SVG connecting lines
    const generateConnections = (nodes, positions, connections = []) => {
        nodes.forEach((node) => {
            if (expanded[node.HRIS] && node.children && node.children.length > 0) {
                const parentPos = positions[node.HRIS];

                node.children.forEach((child) => {
                    const childPos = positions[child.HRIS];
                    if (parentPos && childPos) {
                        connections.push({
                            from: {
                                x: parentPos.x + parentPos.width / 2,
                                y: parentPos.y + parentPos.height
                            },
                            to: {
                                x: childPos.x + childPos.width / 2,
                                y: childPos.y
                            }
                        });
                    }
                });

                // Recursively generate connections for children
                generateConnections(node.children, positions, connections);
            }
        });

        return connections;
    };

    // Get all visible nodes (flattened)
    const getAllVisibleNodes = (nodes, allNodes = []) => {
        nodes.forEach((node) => {
            allNodes.push(node);
            if (expanded[node.HRIS] && node.children && node.children.length > 0) {
                getAllVisibleNodes(node.children, allNodes);
            }
        });
        return allNodes;
    };

    const allVisibleNodes = getAllVisibleNodes(employees);
    const nodePositions = calculatePositions(employees);
    const connections = generateConnections(employees, nodePositions);

    // Calculate SVG dimensions
    const maxX = Math.max(...Object.values(nodePositions).map(pos => pos.x + pos.width), 800);
    const maxY = Math.max(...Object.values(nodePositions).map(pos => pos.y + pos.height), 400);

    return (
        <div className="bg-gray-50">
            <div className="bg-transparent">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                <SlOrganization className="mr-3 text-red-600" size={28} />
                                Organization Chart
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {/* {searchTerm ? `Search results for "${searchTerm}"` : `Showing ${user?.branch_ID ? 'branch' : 'all'} employees`} */}
                            </p>
                        </div>
                        {/* Search Bar */}
                        <div className="ml-auto px-4 w-1/3 sm:px-6 lg:px-8 py-6">
                            <div className="relative mx-auto">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by HRIS..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && searchTerm.trim() !== "") {
                                            expandToHRIS(searchTerm.trim());
                                        }
                                    }}
                                    className="block w-full pl-10 pr-4 py-3 border border-red-200 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />

                                {/* {searchLoading && (
                                <div className="absolute right-3 top-3">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                                </div>
                             )} */}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="relative overflow-auto rounded-lg bg-gray-50">
                <svg width={maxX} height={maxY} className="block mx-auto mt-[-3rem]">
                    {/* Render connection lines */}
                    {connections.map((conn, index) => (
                        <g key={index}>
                            {/* Vertical line from parent */}
                            <line
                                x1={conn.from.x}
                                y1={conn.from.y}
                                x2={conn.from.x}
                                y2={conn.from.y + 15}
                                stroke="#dc2626"
                                strokeWidth="2"
                            />
                            {/* Horizontal line */}
                            <line
                                x1={conn.from.x}
                                y1={conn.from.y + 15}
                                x2={conn.to.x}
                                y2={conn.from.y + 15}
                                stroke="#dc2626"
                                strokeWidth="2"
                            />
                            {/* Vertical line to child */}
                            <line
                                x1={conn.to.x}
                                y1={conn.from.y + 15}
                                x2={conn.to.x}
                                y2={conn.to.y}
                                stroke="#dc2626"
                                strokeWidth="2"
                            />
                        </g>
                    ))}

                    {/* Render employee nodes */}
                    {allVisibleNodes.map((emp) => {
                        const pos = nodePositions[emp.HRIS];
                        if (!pos) return null;

                        const hasChildren = emp.children && emp.children.length > 0;
                        const isExpanded = expanded[emp.HRIS];

                        return (
                            <g key={emp.HRIS}>
                                {/* Node background */}
                                <rect
                                    x={pos.x}
                                    y={pos.y}
                                    width={pos.width}
                                    height={pos.height}
                                    fill="white"
                                    stroke="#dc2626"
                                    strokeWidth="2"
                                    rx="8"
                                    className="cursor-pointer hover:fill-red-50 transition-colors w-[14rem] duration-200"
                                    onClick={() => handleExpand(emp.HRIS)}
                                />

                                {/* Employee image */}
                                <circle
                                    cx={pos.x + 30}
                                    cy={pos.y + pos.height / 2}
                                    r="20"
                                    fill="#dc2626"
                                    className="cursor-pointer"
                                    onClick={() => handleExpand(emp.HRIS)}
                                />
                                <image
                                    x={pos.x + 10}
                                    y={pos.y + pos.height / 2 - 20}
                                    width="40"
                                    height="40"
                                    href={`/${emp.emp_image}`}
                                    clipPath="circle(20px at 20px 20px)"
                                    className="cursor-pointer"
                                    onClick={() => handleExpand(emp.HRIS)}
                                />

                                {/* Employee details */}
                                <text
                                    x={pos.x + 70}
                                    y={pos.y + 25}
                                    className="fill-gray-800 text-sm font-semibold cursor-pointer"
                                    onClick={() => handleExpand(emp.HRIS)}
                                >
                                    {`${emp.first_name} ${emp.last_name}`.length > 18
                                        ? `${emp.first_name} ${emp.last_name}`.substring(0, 18) + '...'
                                        : `${emp.first_name} ${emp.last_name}`}
                                </text>
                                <text
                                    x={pos.x + 70}
                                    y={pos.y + 45}
                                    className="fill-red-600 text-xs cursor-pointer"
                                    onClick={() => handleExpand(emp.HRIS)}
                                >
                                    {emp.position.length > 22 ? emp.position.substring(0, 22) + '...' : emp.position}
                                </text>
                                <text
                                    x={pos.x + 70}
                                    y={pos.y + 60}
                                    className="fill-gray-500 text-xs cursor-pointer"
                                    onClick={() => handleExpand(emp.HRIS)}
                                >
                                    ID: {emp.HRIS}
                                </text>

                                {/* Expand/collapse indicator */}
                                {hasChildren && (
                                    <g>
                                        <circle
                                            cx={pos.x + pos.width - 15}
                                            cy={pos.y + 15}
                                            r="10"
                                            fill="#dc2626"
                                            className="cursor-pointer"
                                            onClick={() => handleExpand(emp.HRIS)}
                                        />
                                        <text
                                            x={pos.x + pos.width - 15}
                                            y={pos.y + 20}
                                            textAnchor="middle"
                                            className="fill-white text-sm font-bold cursor-pointer"
                                            onClick={() => handleExpand(emp.HRIS)}
                                        >
                                            {isExpanded ? "−" : "+"}
                                        </text>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            {employees.length === 0 && (
                <div className="text-center mt-12">
                    <div className="inline-block p-6 bg-red-50 border border-red-200 rounded-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                        <p className="text-red-600 font-medium">Loading organization chart...</p>
                    </div>
                </div>
            )}
        </div>
    );
}