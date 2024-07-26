import { useEffect, useState } from 'react';
import NextLink from 'next/link';
// @mui
import { Box, Button, Card, Container, Divider, FormControlLabel, IconButton, Stack, Switch, Tab, Table, TableBody, TableContainer, TablePagination, Tabs, Tooltip } from '@mui/material';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getBoard, persistColumn, persistCard } from '../../redux/slices/kanban';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// layouts
import Layout from '../../layouts';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { PartnersList } from 'src/sections/@dashboard/partners';
import useSettings from 'src/hooks/useSettings';
import Iconify from 'src/components/Iconify';
import useTable, { emptyRows, getComparator } from 'src/hooks/useTable';
import { useRouter } from 'next/router';
import useTabs from 'src/hooks/useTabs';
import { _userList } from 'src/_mock';
import { paramCase } from 'change-case';
import { UserManager } from 'src/@types/user';
import { UserTableRow, UserTableToolbar } from 'src/sections/@dashboard/partners/list';
import Scrollbar from 'src/components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from 'src/components/table';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['Todos', 'Ativo', 'Inativo'];

const ROLE_OPTIONS = [
  'Todos',
  'ux designer',
  'full stack designer',
  'backend developer',
  'project manager',
  'leader',
  'ui designer',
  'ui/ux designer',
  'front end developer',
  'full stack developer',
];

const TABLE_HEAD = [
  { id: 'name', label: 'Nome', align: 'left' },
  { id: 'company', label: 'Instituição', align: 'left' },
  // { id: 'role', label: 'Role', align: 'left' },
  { id: 'contract', label: 'Contrato', align: 'center' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];
// ----------------------------------------------------------------------

Partners.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Partners() {

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettings();

  const { push } = useRouter();

  const [tableData, setTableData] = useState(_userList);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('Todos');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('Todos');

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = (id: string) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
  };

  const handleDeleteRows = (selected: string[]) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id: string) => {
    push(PATH_DASHBOARD.user.edit(paramCase(id)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);


  return (
    <Page title="Partners" sx={{ height: 1 }}>
      <Container maxWidth={themeStretch ? false : 'lg'} sx={{ height: 1 }}>
        <HeaderBreadcrumbs
          heading="Partners"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            { name: 'Partners' },
          ]}
          action={
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
          >
            <NextLink href={PATH_DASHBOARD.general.partners} passHref>
              
              <Button variant="outlined" startIcon={<Iconify icon={'eva:file-fill'} />}>
                Relatório
              </Button>
            </NextLink>
            <NextLink href={PATH_DASHBOARD.general.partners} passHref>
              <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                Novo Sócio
              </Button>
            </NextLink>
          </Stack>
          }
        />
                <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onChangeFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab disableRipple key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <UserTableToolbar
            filterName={filterName}
            filterRole={filterRole}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            optionsRole={ROLE_OPTIONS}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  actions={
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.name)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              labelRowsPerPage="Linhas por página"
              rowsPerPageOptions={[5,10,25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
{/* 
            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            /> */}
          </Box>
        </Card>
        {/* <PartnersList /> */}
      </Container>
    </Page>
  );
}


// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterName,
  filterStatus,
  filterRole,
}: {
  tableData: UserManager[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterRole: string;
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item: Record<string, any>) =>
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'Todos') {
    tableData = tableData.filter((item: Record<string, any>) => item.status === filterStatus);
  }

  if (filterRole !== 'Todos') {
    tableData = tableData.filter((item: Record<string, any>) => item.role === filterRole);
  }

  return tableData;
}
