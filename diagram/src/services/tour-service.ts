import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { IVLaPEvents } from '../types';
import { EventsService } from './event-service';
import Container from 'typedi';

export class TourService {
    private static tour: ReturnType<typeof driver>;
    private static steps: {
        element: HTMLElement,
        popover: {
            title: string,
            description: string,
            position: 'top' | 'bottom' | 'left' | 'right' | 'over',
        }
    }[] = [];

    static init(elements: {
        graphContainer: HTMLElement,
        historyControl: HTMLElement,
        navigationControl: HTMLElement,
        chatControl: HTMLElement,
        diagramControl: HTMLElement,
        perspectiveControl: HTMLElement,
        breadcrumbControl: HTMLElement,
        helpControl: HTMLElement,
    }) {

        if (TourService.tour) return;

        
        TourService.steps = [
            {
                element: elements.graphContainer,
                popover: {
                    title: 'Welcome!',
                    description: 'This is where you can explore your program',
                    position: 'bottom'
                }
            },
            {
                element: elements.historyControl,
                popover: {
                    title: 'History',
                    description: 'This control enables traversal through git history.',
                    position: 'bottom'
                }
            },
            {
                element: elements.navigationControl,
                popover: {
                    title: 'Navigation',
                    description: 'Zoom, go back, and move forward.',
                    position: 'bottom'
                }
            },
            {
                element: elements.chatControl,
                popover: {
                    title: 'Chat',
                    description: 'Ask questions to the AI about the diagram.',
                    position: 'bottom'
                }
            },
            {
                element: elements.diagramControl,
                popover: {
                    title: 'Control',
                    description: 'Toggle what’s visible on the screen.',
                    position: 'bottom'
                }
            },
            {
                element: elements.perspectiveControl,
                popover: {
                    title: 'Perspective',
                    description: 'Toggle between different perspectives when available',
                    position: 'bottom'
                }
            },
            {
                element: elements.breadcrumbControl,
                popover: {
                    title: 'Breadcrumb',
                    description: 'See and navigate to higher levels of abstraction',
                    position: 'bottom'
                }
            },
            {
                element: elements.helpControl,
                popover: {
                    title: 'Help',
                    description: 'Restart the tour anytime from the Help button',
                    position: 'bottom'
                }
            },

            {
                element: elements.graphContainer,
                popover: {
                    title: 'All done!',
                    description: 'That is it for now, enjoy!',
                    position: 'top',
                },
            }
        ];

        TourService.tour = driver({
            animate: true,
            allowClose: false,
            showProgress: true,
            doneBtnText: 'Finish',
            nextBtnText: 'Next',
            prevBtnText: 'Back',
            onDestroyed: () => {
                localStorage.setItem('umlTourDone', 'true'); 
                Container.get(EventsService).emit(IVLaPEvents.HELP_EVENT, {type:'end', data:''})
              }
        });
    }

    static startTour(elements: {
        graphContainer: HTMLElement,
        historyControl: HTMLElement,
        navigationControl: HTMLElement,
        chatControl: HTMLElement,
        diagramControl: HTMLElement,
        perspectiveControl: HTMLElement,
        breadcrumbControl: HTMLElement,
        helpControl: HTMLElement,
    }) {
        TourService.init(elements);
        TourService.tour.setSteps(TourService.steps);
        TourService.tour.drive(); // starts the tour
    }
}