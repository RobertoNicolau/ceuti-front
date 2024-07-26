
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// layouts
import Layout from '../../layouts';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';


// sections
// import SectionName from '../../sections/SectionName';
import { ExampleComponent } from '../../sections/@dashboard/example';
// ----------------------------------------------------------------------

Example.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Example() {

  return (
    <Page title="Example" sx={{ height: 1 }}>
      <Container maxWidth={false} sx={{ height: 1 }}>
        <HeaderBreadcrumbs
          heading="Example"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            { name: 'Example' },
          ]}
        />


      {/* Your Section Here */}
      <ExampleComponent
        prop1='Hello'
        prop2='World'
      />

      </Container>
    </Page>
  );
}
