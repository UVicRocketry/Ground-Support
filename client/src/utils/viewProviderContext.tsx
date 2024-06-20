import {
    useReducer,
    useContext,
    createContext,
    PropsWithChildren,
    useState
} from "react";

// Views
import RocketSelectionView from "../views/rocket-selection-view";
import ComponentDocs from "../views/component-docs-view";
import RocketDetailsView from "../views/rocket-details-view";
import DataConfigView from "../views/data-config-view";
import ActiveMissionView from "../views/active-mission";
import { ActiveMissionProvider } from "./ActiveMissionContext";
import PlatformSelector from "../views/platform-selector";
import EngineMonitoringView from "../views/pdp-monitoring/engine-monitoring-view";


export enum ViewKeys {
    PLATFORM_SELECTION_KEY = 'PLATFORM_SELECTION',
    ROCKET_SELECT_KEY = 'ROCKET_SELECT',
    COMPONENT_DOCUMENT_KEY = 'COMPONENT_DOCUMENT',
    ROCKET_DETAILS_KEY = 'ROCKET_DETAILS',
    DATA_CONFIG_KEY = 'DATA_CONFIG',
    ACTIVE_FLIGHT_KEY = 'ACTIVE_FLIGHT',
    MISSION_REPLAY_KEY = 'MISSION_REPLAY',
    PDP_MONITORING_KEY = 'PDP_MONITORING'

}

export interface IViewProviderContext {
    viewState: { 
        viewKey: ViewKeys; 
        currentView: any 
    };
    updateViewKey: (view: ViewKeys) => void;
}

export const ViewProviderContext = createContext<IViewProviderContext>({
    viewState: { 
        viewKey: ViewKeys.PLATFORM_SELECTION_KEY, 
        currentView: <PlatformSelector />
    },
    updateViewKey: (view: ViewKeys) => { }
});

export const ViewContextProvider = ({ children }: PropsWithChildren<any>) => {
    const [
        viewState, 
        viewDispatch
    ] = useReducer(viewReducer, {
        viewKey: ViewKeys.PLATFORM_SELECTION_KEY,
        currentView: <PlatformSelector />
    });    

    function viewReducer(_: any, action: any) {
        switch (action.type) {
            case ViewKeys.PLATFORM_SELECTION_KEY:
                return {
                    viewKey: ViewKeys.PLATFORM_SELECTION_KEY,
                    currentView: <PlatformSelector />
                }
            case ViewKeys.ROCKET_SELECT_KEY:
                return {
                    viewKey: ViewKeys.ROCKET_SELECT_KEY,
                    currentView: <RocketSelectionView />
                }
            case ViewKeys.COMPONENT_DOCUMENT_KEY:
                return {
                    viewKey: ViewKeys.COMPONENT_DOCUMENT_KEY,
                    currentView: <ComponentDocs />
                }
            case ViewKeys.ROCKET_DETAILS_KEY:
                return {
                    viewKey: ViewKeys.ROCKET_DETAILS_KEY,
                    currentView: <RocketDetailsView />
                }
            case ViewKeys.DATA_CONFIG_KEY:
                return {
                    viewKey: ViewKeys.DATA_CONFIG_KEY,
                    currentView: <DataConfigView />
                }
            case ViewKeys.ACTIVE_FLIGHT_KEY:
                return {
                    viewKey: ViewKeys.ACTIVE_FLIGHT_KEY,
                    currentView: <ActiveMissionView />
                }
            case ViewKeys.MISSION_REPLAY_KEY:
                return {
                    viewKey: ViewKeys.MISSION_REPLAY_KEY,
                    currentView: <></>
                }
            case ViewKeys.PDP_MONITORING_KEY:
                return {
                    viewKey: ViewKeys.PDP_MONITORING_KEY,
                    currentView: <EngineMonitoringView />
                }
            default:
                throw Error(`Unknown action type: ${action.type}`);
        }
    }


    const updateViewKey = (view: ViewKeys) => {
        viewDispatch({ type: view });
    };

    

    return (
        <ViewProviderContext.Provider 
            value={{ 
                viewState,
                updateViewKey, 
            }}
        >   
            <ActiveMissionProvider>
                {viewState.currentView}
            </ActiveMissionProvider>
        </ViewProviderContext.Provider>
    );
}

export const useViewProvider = () => useContext<IViewProviderContext>(ViewProviderContext)