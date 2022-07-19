import * as React from 'react';
import { useState, useEffect } from 'react';
import { PageSection, Title } from '@patternfly/react-core';
import { SearchInput } from '@patternfly/react-core';
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


function MyCard() {
  const [term, setTerm] = useState("");

  const searchTermUpdated = (val: string) => {
    setTerm(val);
  };
  return (
    <>
      <SearchInput
        placeholder="Find by Parent"
        value={term}
        onChange={v => searchTermUpdated(v)}
        onClear={evt => searchTermUpdated('')}
      />
      <MyComponent param1={term}/>
    </>
  );
}
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
function MyComponent(props: { param1: string }) {
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
  useEffect(() => {
    if (props.param1 == null || props.param1 === "") {
      setIsLoaded(false);
      return;
    }
    fetch("/query/under/"+props.param1)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [props.param1])

  if (error) {
    return <div>Error: {error["message"]}</div>;
  } else if (!isLoaded) {
    return <div>Type some search term to begin search...</div>;
  } else if (items.length == 0) {
    return <div>0 results.</div>;
  } else {
    return (
      <>
        <Accordion isBordered displaySize={'large'}>
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
  }
}

const ParentSearch: React.FunctionComponent = () => (
  <PageSection>
    <Title headingLevel="h1" size="lg">
      Parent Search
    </Title>
    <MyCard/>
  </PageSection>
);

export { ParentSearch as ParentSearch };
