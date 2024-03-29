package com.myklovr.api.cassandra;

import java.util.List;
import java.util.Map;

import com.datastax.driver.core.BoundStatement;
import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.PreparedStatement;
import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.myklovr.helpers.PropertiesHelper;
import com.myklovr.helpers.constants.PropertiesConstants;

public class CassandraDriver {

	private static final Cluster cluster = Cluster.builder()
	                  .addContactPoint(PropertiesHelper.getStringConfigProperty(PropertiesConstants.CONFIG_DATABASE_HOST))
	                  .withPort(PropertiesHelper.getIntConfigProperty(PropertiesConstants.CONFIG_DATABASE_PORT))
	                  .withCredentials(PropertiesHelper.getStringConfigPropertyEncrypted(PropertiesConstants.CONFIG_DATABASE_USERNAME), PropertiesHelper.getStringConfigPropertyEncrypted(PropertiesConstants.CONFIG_DATABASE_PASSWORD))
	                  .build();
	private static final Session session = cluster.connect(PropertiesHelper.getStringConfigPropertyEncrypted(PropertiesConstants.CONFIG_DATABASE_KEYSTORE));
		
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static ResultSet executeStatement(String stringStatement, List<Object> args){
		PreparedStatement statement = session.prepare(stringStatement);
		BoundStatement boundStatement = new BoundStatement(statement);
		boundStatement.bind();	
		Integer i =0;
		for(Object obj : args){
			if (obj instanceof Map){
				boundStatement.setMap(i,(Map)obj);
			}else{
				boundStatement.set(i, obj, (Class)obj.getClass());
			}
			
			i++;
		}				
		return session.execute(boundStatement);
	}
	
	
}
