import { Paper } from '@mui/material';
import AbstractSubmissionForm from '../../forms/AbstractSubmissionForm';

interface IAbstractSubmissionPortalProps {
}

const AbstractSubmissionPortal = ({ }: IAbstractSubmissionPortalProps) => {
	return <>
		<Paper className='d-flex flex-column h-100' elevation={5} sx={{ height: 630, borderTop: 12, borderColor: 'primary.main', padding: { xs: 2, sm: 3, md: 5 } }}>
			<AbstractSubmissionForm />
		</Paper>
	</>
};

export default AbstractSubmissionPortal;
