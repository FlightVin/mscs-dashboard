import { useState } from "react";
import { Row, Col, Drawer } from "antd";
import { withTranslation } from "react-i18next";
import Container from "../../common/Container";
import { SvgIcon } from "../../common/SvgIcon";
import { Button } from "../../common/Button";
import {
  HeaderSection,
  LogoContainer,
  Burger,
  NotHidden,
  Menu,
  CustomNavLinkSmall,
  Label,
  Outline,
  Span,
} from "./styles";
import { Link } from 'react-router-dom';

const Header = ({ t }: any) => {
  const [visible, setVisibility] = useState(false);

  const showDrawer = () => {
    setVisibility(!visible);
  };

  const onClose = () => {
    setVisibility(!visible);
  };

  const MenuItem = () => {
    const scrollTo = (id: string) => {
      const element = document.getElementById(id) as HTMLDivElement;
      element.scrollIntoView({
        behavior: "smooth",
      });
      setVisibility(false);
    };
    return (
      <>
        <Link to="/societies">
          <CustomNavLinkSmall>
            <Span>{t("Societies")}</Span>
          </CustomNavLinkSmall>
        </Link>

        <Link to="/viz">
          <CustomNavLinkSmall>
            <Span>{t("Visualizations")}</Span>
          </CustomNavLinkSmall>
        </Link>

        <Link to="/">
          <CustomNavLinkSmall>
            <Span>{t("Login")}</Span>
          </CustomNavLinkSmall>
          </Link>


        <Link to="/">
          <CustomNavLinkSmall
            style={{ width: "140px" }}
          >
            <Span>
              <Button>{t("Home")}</Button>
            </Span>
          </CustomNavLinkSmall>
        </Link>
      </>
    );
  };

  return (
    <HeaderSection>
      <Container>
        <Row justify="space-between">
          <LogoContainer to="/" aria-label="homepage">
            <img src="img/icons/MSCS_LOGO.png" width="100px" height="100px" />
          </LogoContainer>
          <NotHidden>
            <MenuItem />
          </NotHidden>
          <Burger onClick={showDrawer}>
            <Outline />
          </Burger>
        </Row>
        <Drawer closable={false} visible={visible} onClose={onClose}>
          <Col style={{ marginBottom: "2.5rem" }}>
            <Label onClick={onClose}>
              <Col span={12}>
                <Menu>Menu</Menu>
              </Col>
              <Col span={12}>
                <Outline />
              </Col>
            </Label>
          </Col>
          <MenuItem />
        </Drawer>
      </Container>
    </HeaderSection>
  );
};

export default withTranslation()(Header);
