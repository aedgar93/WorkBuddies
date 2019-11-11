import React from 'react'
import styles from './GetStarted.module.css'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import CompanyForm from '../../shared/companyForm'
import { ROUTES } from '../../utils/constants'

const GetStarted = ({ history }) => {
  const onSubmit = (params) => {
    history.push(ROUTES.SIGN_UP, {company: params})
    return Promise.resolve()
  }

  //TODO: show error if history.location.state.error
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>
        Step 1
      </h3>
      <div className={styles.subtitle}>Get Started with a Company</div>
      <Accordion defaultActiveKey="0" className={styles.content}>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              Create a company account
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <CompanyForm onSubmit={onSubmit}/>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="1">
              Join a company
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body>In order to join an existing company account you must receive an email invite. Please contact your company admin.</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  )
}

export default GetStarted
