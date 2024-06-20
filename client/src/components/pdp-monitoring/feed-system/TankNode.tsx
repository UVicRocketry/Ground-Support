import { memo, useState } from 'react';
import { 
  Handle, 
  Position
} from 'reactflow';

import { TankTypesSVGs, TankTypeKeys, TankTypeStrings } from '../../../static/tanks/TankTypes';
import { Stack, Typography } from '@mui/material';

const PAndIDTankNode = ({ data, isConnectable }) => {
  const [Tank, setTank] = useState(data.tankType);
  return (
    <Stack direction="column" spacing={0} alignItems={'center'} justifyItems={'center'}>
      <Stack direction="row" alignItems={'center'} justifyItems={'center'}>
        <Handle 
          type={Tank == 'TankTank' ? "source" : "target"}
          position={Position.Top}
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={isConnectable}
        />
        <img 
          src={TankTypesSVGs[Tank]} 
          alt="Tank" 
        />
        <Handle 
          type="target"
          position={Position.Bottom}
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={isConnectable}
        />
      </Stack>
      <Typography variant="body1">{data.label}</Typography>
    </Stack>
  );
}

export default memo(PAndIDTankNode);
