import { memo, useEffect, useState } from 'react';
import { 
  Handle, 
  Position
} from 'reactflow';

import { ValveTypeSVGs, ValveTypeKeys } from '../../../static/valves/ValveTypes'
import ValveControl from '../ValveControlSwitch';
import { Stack, Typography } from '@mui/material';


const PAndIDValveNode = ({ data, isConnectable, selected, controllable }) => {
  const [Valve, setValve] = useState(data.valveType);
  const [handleMargin, setHandleMargin] = useState(5);

  useEffect(() => {
    setValve(ValveTypeSVGs[data.valveType]);
    switch (data.valveType) {
      case 'BallValve':
		setHandleMargin(5);
        break;
      case 'CheckValve':
		setHandleMargin(5);
        break;
      case 'NeedleValve':
        setHandleMargin(5);
        break;
      case 'HandOperatedValve':
		setHandleMargin(15);
        break;
      case 'MotorValve':
		setHandleMargin(25);
        break;
      case 'PneumaticValve':
		setHandleMargin(23);
        break;
      case 'SolenoidValve':
		setHandleMargin(27);
        break;
      case 'SpringValve':
		setHandleMargin(25);
        break;
      case 'RegulatorValve':
		setHandleMargin(15);
        break;
      case 'PressureRegulatorValve':
        setHandleMargin(30);
        break;
      default:
        setHandleMargin(5);
    }
  }, [data.valveType]);

  return (
		<Stack direction="column" spacing={0} alignItems={'center'} justifyItems={'center'}>
			<Stack direction="row" alignItems={'center'} justifyItems={'center'}>
				<Handle 
					type="source"
					style={{ position: "relative", marginTop: handleMargin }}
					position={Position.Left}
					onConnect={(params) => console.log('handle onConnect', params)}
					isConnectable={isConnectable}
				/>
				<img 
					src={Valve} 
					alt={data.valveType} 
				/>
				<Handle
					style={{ position: "relative", marginTop: handleMargin }}
					type="target"
					position={Position.Right}
					id="b"
					isConnectable={isConnectable}
				/>
			</Stack>
			{!data.controllable && <Typography variant="body1">{data.label}</Typography>}
			{data.controllable && (
				<ValveControl
					valveName={data.label}
				/>
			)}
		</Stack>
  );
};

export default memo(PAndIDValveNode);