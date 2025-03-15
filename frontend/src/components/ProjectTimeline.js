import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react'; // FullCalendar component
import timelinePlugin from '@fullcalendar/timeline'; // Timeline plugin
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'; // Resource timeline plugin
import interactionPlugin from '@fullcalendar/interaction'; // For drag-and-drop
import { useParams } from 'react-router-dom';
import moment from 'moment';


const ProjectTimeline = () => {

    const { projectId } = useParams();
    const [resources, setResources] = useState([]); // Resources (e.g., team members)
    const [events, setEvents] = useState([]); // Tasks or events

    // Fetch tasks and resources for the specific project
    useEffect(() => {
        // Sample data for resources (e.g., team members)
        const sampleResources = [
            { id: '1', title: 'Team Member 1' },
            { id: '2', title: 'Team Member 2' },
        ];

        // Sample data for tasks
        const sampleEvents = [
            {
                id: '1',
                resourceId: '1', // Assigned to Team Member 1
                title: 'Task 1',
                start: moment().add(-2, 'days').toISOString(), // Start time
                end: moment().add(3, 'days').toISOString(), // End time
                projectId: '67d0586dd9f8d1460f6780b4', // Belongs to Project 1
            },
            {
                id: '2',
                resourceId: '1', // Assigned to Team Member 1
                title: 'Task 2',
                start: moment().add(-1, 'days').toISOString(),
                end: moment().add(2, 'days').toISOString(),
                projectId: '67d0586dd9f8d1460f6780b4', // Belongs to Project 1
            },
            {
                id: '3',
                resourceId: '2', // Assigned to Team Member 2
                title: 'Task 3',
                start: moment().add(0, 'days').toISOString(),
                end: moment().add(4, 'days').toISOString(),
                projectId: '67d0586dd9f8d1460f6780b4', // Belongs to Project 2
            },
        ];

        // Filter tasks for the specific project
        const filteredEvents = sampleEvents.filter((event) => event.projectId === projectId);
        console.log('Filtered Events:', filteredEvents); // Debugging
        console.log('Resources:', sampleResources); // Debugging

        setResources(sampleResources);
        setEvents(filteredEvents);
    }, [projectId]);
    return (
        <div>
            {/* Render FullCalendar with Timeline View */}
            <div style={{ height: '500px', marginTop: '20px' }}>
                <FullCalendar
                    plugins={[timelinePlugin, resourceTimelinePlugin, interactionPlugin]}
                    initialView="resourceTimelineMonth" // Default view
                    resources={resources} // Resources (e.g., team members)
                    events={events} // Tasks or events
                    editable={true} // Allow events to be editable
                    headerToolbar={{
                        left: 'today prev,next',
                        center: 'title',
                        right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth',
                    }}
                    resourceAreaWidth="20%" // Width of the resource area
                    resourceAreaHeaderContent="Team Members" // Header for the resource area
                    eventContent={(eventInfo) => (
                        <div style={{ padding: '4px', backgroundColor: '#4A90E2', color: 'white', borderRadius: '4px' }}>
                            {eventInfo.event.title}
                        </div>
                    )}
                />
            </div>
        </div>
    )
}

export default ProjectTimeline