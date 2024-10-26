import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../asset/image/logo.png'; // Adjust path as needed

export const generatePDFReport = (reportData, allUsers, selectedUser, currentUser) => {
    const doc = new jsPDF();
    
    // Find user information
    let targetUserInfo = null;
    if (selectedUser && allUsers) {
        targetUserInfo = allUsers.find(u => u._id === selectedUser);
    }
    if (!targetUserInfo) {
        targetUserInfo = currentUser;
    }
    
    // Add header with logo
    doc.addImage(logo, 'PNG', 15, 10, 30, 30);
    doc.setFontSize(20);
    doc.text('Managewise User Report', 50, 25);
    
    // Add report generation date and user info
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 35);
    
    // Add user information section
    doc.setFontSize(12);
    doc.setTextColor(70, 70, 70);
    if (targetUserInfo) {
        doc.text([
            `Report for: ${targetUserInfo.name || 'N/A'}`,
            `Email: ${targetUserInfo.email || 'N/A'}`,
            `Role: ${targetUserInfo.admin ? 'Administrator' : 'User'}`
        ], 50, 45);
    }

    let yPos = 70; // Adjusted starting position to accommodate user info

    // Summary Section
    doc.setTextColor(0, 0, 0); // Reset text color to black
    doc.setFontSize(14);
    doc.text('Summary', 15, yPos);
    yPos += 10;

    // Safely access nested properties
    const metrics = reportData?.userPerformanceMatrix?.userPerformanceMetrics || {};
    const summaryData = [
        ['Total Tasks', metrics.totalTasks || 0],
        ['Completed Tasks', metrics.completedTasks || 0],
        ['Task Completion Rate', metrics.taskCompletionRate ? `${(metrics.taskCompletionRate * 100).toFixed(1)}%` : '0%'],
        ['Average Completion Time', metrics.averageCompletionTime ? `${metrics.averageCompletionTime.toFixed(1)} days` : '0 days'],
    ];

    doc.autoTable({
        startY: yPos,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        margin: { left: 15 },
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // Pool Task Distribution
    doc.setFontSize(14);
    doc.text('Pool Task Distribution', 15, yPos);
    yPos += 10;

    const statusBreakdown = reportData?.poolTaskPartion?.taskCompletionSummary?.statusBreakdown || [];
    const poolData = statusBreakdown.length > 0 
        ? statusBreakdown.map(item => [item.status || 'Unknown', item.count || 0])
        : [['No pools available', 0]];

    doc.autoTable({
        startY: yPos,
        head: [['Pool Name', 'Task Count']],
        body: poolData,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        margin: { left: 15 },
        columnStyles: {
            0: { cellWidth: 150 }, // Pool Name - wider
            1: { cellWidth: 30 }   // Task Count - narrower
        }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // Task Details Section
    doc.setFontSize(14);
    doc.text('Completed Tasks', 15, yPos);
    yPos += 10;

    const completedTasks = reportData?.theGreatTaskFilter?.completedTasks || [];
    const completedTasksData = completedTasks.length > 0 
        ? completedTasks.map(task => [
            task.name || 'Untitled Task',
            task.poolName || 'N/A',
            task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A',
            task.dueDate?.[1] ? new Date(task.dueDate[1]).toLocaleDateString() : 'N/A'
        ])
        : [['No completed tasks available', '-', '-', '-']];

    doc.autoTable({
        startY: yPos,
        head: [['Task Name', 'Pool', 'Created Date', 'Due Date']],
        body: completedTasksData,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        margin: { left: 15 },
        columnStyles: {
            0: { cellWidth: 50 },  // Task Name
            1: { cellWidth: 80 },  // Pool
            2: { cellWidth: 25 },  // Created Date
            3: { cellWidth: 25 }   // Due Date
        }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // Add new page if needed
    if (yPos > 250) {
        doc.addPage();
        yPos = 20;
    }

    // Incomplete Tasks Section
    doc.setFontSize(14);
    doc.text('Incomplete Tasks', 15, yPos);
    yPos += 10;

    const incompleteTasks = reportData?.theGreatTaskFilter?.incompleteTasks || [];
    const incompleteTasksData = incompleteTasks.length > 0
        ? incompleteTasks.map(task => {
            // Get the last progress entry
            const lastProgress = task.progress && task.progress.length > 0 
                ? task.progress[task.progress.length - 1] 
                : null;
            
            // Find the user info for the last person who made progress
            const lastUpdatedBy = lastProgress 
                ? allUsers.find(u => u._id === lastProgress.CID || u.uid === lastProgress.CID)?.name || 'Unknown User'
                : 'No Updates';

            const lastUpdateDate = lastProgress
                ? new Date(lastProgress.date).toLocaleDateString()
                : 'N/A';

            return [
                task.name || 'Untitled Task',
                task.poolName || 'N/A',
                task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A',
                task.dueDate?.[1] ? new Date(task.dueDate[1]).toLocaleDateString() : 'N/A',
                `${lastUpdatedBy} (${lastUpdateDate})`
            ];
        })
        : [['No incomplete tasks available', '-', '-', '-', '-']];

    doc.autoTable({
        startY: yPos,
        head: [['Task Name', 'Pool', 'Created Date', 'Due Date', 'Last Updated By (Date)']],
        body: incompleteTasksData,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        margin: { left: 15 },
        columnStyles: {
            0: { cellWidth: 50 },  // Task Name
            1: { cellWidth: 35 },  // Pool
            2: { cellWidth: 25 },  // Created Date
            3: { cellWidth: 25 },  // Due Date
            4: { cellWidth: 45 }   // Last Updated By (Date)
        }
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, 287, { align: 'center' });
    }

    return doc;
};
