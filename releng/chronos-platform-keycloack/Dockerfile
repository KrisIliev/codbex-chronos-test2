# Docker descriptor for codbex
# License - http://www.eclipse.org/legal/epl-v20.html

FROM tomcat:9.0.56-jre11-openjdk

COPY target/ROOT.war $CATALINA_HOME/webapps/
RUN unzip $CATALINA_HOME/webapps/ROOT.war -d $CATALINA_HOME/webapps/ROOT
RUN rm $CATALINA_HOME/webapps/ROOT.war

RUN curl https://repo1.maven.org/maven2/org/keycloak/keycloak-tomcat8-adapter-dist/4.0.0.Beta3/keycloak-tomcat8-adapter-dist-4.0.0.Beta3.zip --create-dirs -o /usr/local/tomcat/lib/keycloak-tomcat8-adapter-dist.zip
RUN cd /usr/local/tomcat/lib && unzip keycloak-tomcat8-adapter-dist.zip
COPY src/main/webapp/META-INF/context.xml /usr/local/tomcat/webapps/ROOT/META-INF/
COPY src/main/webapp/WEB-INF/keycloak.json /usr/local/tomcat/webapps/ROOT/WEB-INF/
COPY src/main/webapp/WEB-INF/keycloak.json /usr/local/tomcat/webapps/ROOT/WEB-INF/

RUN wget https://search.maven.org/remotecontent?filepath=org/postgresql/postgresql/42.5.0/postgresql-42.5.0.jar -P /usr/local/tomcat/lib/

ENV DIRIGIBLE_JAVASCRIPT_GRAALVM_DEBUGGER_PORT=0.0.0.0:8081
