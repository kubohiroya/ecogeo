import styled from "@emotion/styled";

/* eslint-disable-next-line */
export interface ReferenceSectionProps {}

const StyledReferenceSection = styled.div`
  color: #333;

  h3 {
    margin-top: 20px;
    margin-bottom: 0;
  }

  ul {
    margin-top: 4px;
    font-size: 80%;
  }
`;

export function ReferenceSection(props: ReferenceSectionProps) {
  return (
    <StyledReferenceSection>
      <h3>References</h3>
      <ul>
        <li>
          Krugman, P. (1993) On the number and location of cities.{' '}
          <i>European Economic Review</i>, Vol. 37 (2-3) pp.293-298.
        </li>
        <li>
          Fujita, M., Krugman, P., Venables, A. (1999) "The Spatial Economy:
          Cities, Regions, and International Trade", <i>MIT Press</i>.
        </li>
      </ul>
    </StyledReferenceSection>
  );
}

export default ReferenceSection;
