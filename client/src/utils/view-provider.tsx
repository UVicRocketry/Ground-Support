import { useEffect, useReducer, useState } from 'react';
import { ViewContextProvider, useViewProvider } from './viewProviderContext';
import '../root/App.css'

export default function ViewProvider() {
	const viewProviderContext = useViewProvider();
	useEffect(() => {
		console.log(`view key: ${viewProviderContext.viewState.viewKey}`);
	}, [viewProviderContext.viewState.viewKey]);
    return (
		<div className='app'>
			<ViewContextProvider />
        </div>
    );
}