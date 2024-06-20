import React, { useState, useEffect } from 'react';
import { 
	LineChart, 
	Line, 
	XAxis, 
	YAxis, 
	CartesianGrid, 
	Tooltip, 
	Legend, 
	ResponsiveContainer
} from 'recharts';
import { IAprsTelemetryPacket } from '../utils/TelemetryTypes';

interface GraphProps {
	dataKeys: string[];
	packet?: IAprsTelemetryPacket;
	staticData: any[];
	realTime: boolean;
}

const InsGraph: React.FC<GraphProps> = (props: GraphProps) => {
	const { dataKeys, staticData, realTime, packet } = props;
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		if (realTime && packet?.Parsed.altitude > 0) {
			setData((prev) => [
				...prev, 
				{
					Altitude: packet?.Parsed.altitude
				}
			]);
		}
	}, [packet]);

	useEffect(() => {
		setData(staticData);
	}, [])

	return (
		<ResponsiveContainer width="100%" height={"50%"}>
			<LineChart  data={data}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="Time" />
				<YAxis domain={[]}/>
				<Tooltip />
				<Legend align='center' />
				{dataKeys && dataKeys.map((key, index) => {
					if (key !== 'Time') {
						return (
							<Line 
								key={index} 
								type="monotone" 
								dataKey={key} 
								stroke={`hsl(${index * 360 / dataKeys.length}, 100%, 50%)`}
								strokeWidth={3} 
								activeDot={{ r: 8 }} 
								isAnimationActive={!realTime} 
							/>
						);
					}
					return null;
				})}
			</LineChart>
		</ResponsiveContainer>
	);
};

export default InsGraph;