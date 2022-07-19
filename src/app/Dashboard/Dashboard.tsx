import * as React from 'react';
import { useState, useEffect } from 'react';
import { PageSection, Title } from '@patternfly/react-core';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionToggle,
  AccordionExpandedContentBody,
  Button,
  Checkbox
} from '@patternfly/react-core';
import ArrowRightIcon from '@patternfly/react-icons/dist/esm/icons/arrow-right-icon';
import { Label } from '@patternfly/react-core';
import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription
} from '@patternfly/react-core';
import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { OtterIcon } from '@patternfly/react-icons';
import { CodeBlock, CodeBlockAction, CodeBlockCode, ClipboardCopyButton } from '@patternfly/react-core';

interface TestComponentProps {
  str: string[];
}
function TestComponent({str}: TestComponentProps) {
  return (
    <>
      {str.map(item => (
        <Label isCompact color={item.startsWith("location")?"blue":item.startsWith("oncall")?"red":"green"}>{item}</Label>
      ))
      }
    </>
  )
}

function MyComponent() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  const [expanded, setExpanded] = React.useState('ex-toggle4');
  const [isDisplayLarge, setIsDisplayLarge] = React.useState(false);

  const displaySize = isDisplayLarge ? 'large' : 'default';
  const onToggle = (id: string) => {
    if (id === expanded) {
      setExpanded('');
    } else {
      setExpanded(id);
    }
  };

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch("/hello")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error["message"]}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <Accordion isBordered displaySize={displaySize}>
        {items.map(item => (
          <AccordionItem>
            <AccordionToggle
              onClick={() => {
                onToggle(item["id"]);
              }}
              isExpanded={expanded === item["id"]}
              id={item["id"]}
            >
              <span style={{display: 'inline-block', width: '50px'}}>{item["id"]}</span>
              <b>{item["ceuuid"]}</b>
              <span style={{display: 'inline-block', width: '10px'}}> </span>
              <TestComponent str={item["mytag"]}/>
            </AccordionToggle>
            <AccordionContent id={"ex-expand"+item["id"]} isHidden={expanded !== item["id"]}>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>id</DescriptionListTerm>
                <DescriptionListDescription>{item["id"]}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>cloudevent UUID</DescriptionListTerm>
                <DescriptionListDescription>{item["ceuuid"]}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>context (cloudevent data)</DescriptionListTerm>
                <DescriptionListDescription>
                <CodeBlock>
                  <CodeBlockCode>
                    {JSON.stringify(item["context"])}
                  </CodeBlockCode>
                </CodeBlock>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Labels</DescriptionListTerm>
                <DescriptionListDescription>
                  <TestComponent str={item["mytag"]}/>
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
            </AccordionContent>
          </AccordionItem>
                ))}
        </Accordion>
      </>);
    // return (
    //   <ul>
    //     {items.map(item => (
    //       <li key={item["id"]}>
    //         {item["id"]}
    //       </li>
    //     ))}
    //   </ul>
    // );
  }
}


const Dashboard: React.FunctionComponent = () => (
  <PageSection>
    <Title headingLevel="h1" size="lg">List all context cases:</Title>
    <MyComponent/>
  </PageSection>
)

export { Dashboard };
