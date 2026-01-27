import { Container, Paper } from '@mui/material';
import AbstractSubmissionForm from '../../forms/AbstractSubmissionForm';

interface IAbstractSubmissionPortalProps {
}

const AbstractSubmissionPortal = ({ }: IAbstractSubmissionPortalProps) => {
	return <>
		<Container maxWidth='md' sx={{ height:'100%', mt:2 }}>
			<Paper  elevation={5} sx={{ borderTop: 12, borderColor: 'primary.main', padding: { xs: 2, sm: 3, md: 5 } }}>
				<AbstractSubmissionForm />
			</Paper>
		</Container>
	</>
};

export default AbstractSubmissionPortal;
