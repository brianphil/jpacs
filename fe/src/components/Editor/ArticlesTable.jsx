import React from 'react';
import { Table, Button } from 'react-bootstrap';

const ArticlesTable = ({ articles, openViewModal, openAssignModal, openStatusModal, openPublishModal }) => {
  return (
    <div className="table-responsive">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th style={{ width: '25%' }}>Title</th>
            <th style={{ width: '25%' }}>Abstract</th>
            <th style={{ width: '15%' }}>Status</th>
            <th style={{ width: '35%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article._id}>
              <td>{article.title}</td>
              <td className="text-truncate" style={{ maxWidth: '200px' }}>{article.abstract}</td>
              <td>{article.status}</td>
              <td>
                <div className="d-flex flex-wrap gap-2">
                  <Button variant="success" size="sm" onClick={() => openViewModal(article._id)}>
                    View
                  </Button>
                  <Button variant="info" size="sm" onClick={() => openAssignModal(article._id)}>
                    Assign
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => openStatusModal(article._id)}>
                    Update
                  </Button>
                  {article.isApproved? <Button variant='secondary' size='sm'>Published</Button> :
                  <Button variant="warning" size="sm" onClick={() => openPublishModal(article._id)}>
                    Publish
                  </Button>
}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ArticlesTable;