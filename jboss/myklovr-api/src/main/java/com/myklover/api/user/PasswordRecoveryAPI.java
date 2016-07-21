package com.myklover.api.user;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Row;
import com.myklover.api.GenericAPI;
import com.myklover.api.datainfo.user.out.PasswordRecoveryOut;
import com.myklover.helpers.PropertiesHelper;
import com.myklover.helpers.constants.MessagesConstants;
import com.myklover.helpers.exception.BussinesException;;

public class PasswordRecoveryAPI extends GenericAPI{

	
	
	public static PasswordRecoveryOut getPasswordRecoveryByToken(String verificationToken){
		StringBuffer statement = new StringBuffer();
		statement.append("SELECT username,verificationtoken,expirationtimestamp FROM passwordrecovery WHERE verificationtoken= ? ");
		List<Object> args = new ArrayList<Object>();
		args.add(verificationToken);
		ResultSet result = executeStatement(statement.toString(), args);
		List<PasswordRecoveryOut> resultList = new ArrayList<PasswordRecoveryOut>();
		for (Row row : result) {
			resultList.add(getElement(row));
		}
		return resultList.get(0);	
	}	
	
	public static void insertPasswordRecovery(String hashedCode, String username) throws BussinesException{	
		StringBuffer statement = new  StringBuffer();
		statement.append("INSERT INTO passwordrecovery (verificationToken,username,expirationtimestamp) ");		
		statement.append("VALUES (?,?,?)) IF NOT EXISTS");
		List<Object> args = new ArrayList<Object>();
		Calendar expirationTime = Calendar.getInstance();
		expirationTime.add(Calendar.MINUTE, 10);
		args.add(hashedCode);
		args.add(username);
		args.add(expirationTime.getTime());		
		try{
			executeStatement(statement.toString(), args);
		}catch(Exception e){
			throw new BussinesException(PropertiesHelper.getStringMessageProperty(MessagesConstants.ERROR_PASSWORD_RECOVERY_CREATE_VERIFICATION_CODE));	
		}						
	}
	
	private static PasswordRecoveryOut getElement(Row row) {
		PasswordRecoveryOut result = new PasswordRecoveryOut();				
		result.setUsername(row.getString(0));
		result.setVerificationToken(row.getString(1));
		result.setExpirationTimestamp(row.getTimestamp(2));
		return result;		
	}
	
	
}
